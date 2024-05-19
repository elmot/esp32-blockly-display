# IMPORTS
import sys

import machine
import utime as time
import SECRETS

from mqtt_as import MQTTClient, config
import asyncio
import _thread

from hw import LED, DISPLAY

# CONSTANTS
LAST_CODE_PY = 'last_code.py'


class CancelException(Exception):
    pass


_led_thread_interrupt = False


def segm14_check_exit():
    global _led_thread_interrupt
    if _led_thread_interrupt:
        raise CancelException()


def segm14_text(text):
    segm14_check_exit()
    DISPLAY.text(text)


def segm14_symbol(pos, glyph_str):
    segm14_check_exit()
    DISPLAY.symbol(pos, glyph_str)


def segm14_output(pos, glyph_str):
    segm14_symbol(pos, glyph_str)
    DISPLAY.draw()


def segm14_delay(time_sec):
    while time_sec > 0:
        s = time_sec if time_sec < 0.1 else 0.1
        segm14_check_exit()
        time.sleep_ms(int(s * 1000))
        time_sec -= s


async def led_blink(client: MQTTClient):
    bright = True
    while True:
        # noinspection PyProtectedMember
        if not client._sta_if.isconnected():
            if bright:
                LED.set_color(0, 0, 100)
            else:
                LED.set_color(0, 0, 10)
            bright = not bright
        elif client.isconnected():
            LED.set_color(0, 50, 0)
        else:
            LED.set_color(0, 50, 0)
        await asyncio.sleep(0.8)


def led_thread_proc():
    global _led_thread_interrupt
    while True:
        try:
            _led_thread_interrupt = False
            f = open(LAST_CODE_PY, 'r')
            text = f.read()
            f.close()
            DISPLAY.clear()
            DISPLAY.draw()
            exec(text)
        except CancelException:
            pass
        except OSError as e:
            if e.errno == 2:
                print("Last stored script is not found")
            sys.print_exception(e)
        except Exception as e:
            sys.print_exception(e)
        while not _led_thread_interrupt:
            time.sleep_ms(100)


async def mqtt_msg_handler(client):  # Respond to incoming messages
    global _led_thread_interrupt
    async for topic, msg, retained in client.queue:
        if topic.endswith("/python/run"):
            print(f"python code to run arrived, {len(msg)} bytes")
            f = open(LAST_CODE_PY, 'w')
            f.write(msg)
            f.close()
            _led_thread_interrupt = True
        elif topic.endswith("/python/restart"):
            print("python code restart")
            _led_thread_interrupt = True
        else:
            print(f"Unexpected message to {topic}: {msg}")


async def connection_watch(client: MQTTClient):  # Respond to connectivity being (re)established
    while True:
        await client.up.wait()  # Wait on an Event
        client.up.clear()
        await client.subscribe('/python/#', 1)  # renew subscriptions


async def main(client):
    # noinspection PyAsyncCall
    led_task = asyncio.create_task(led_blink(client))
    try:
        print("Starting wifi")
        await client.connect()
    except OSError as e:
        led_task.cancel()
        print(f'Wifi Connect Error: {e}')
        LED.set_color(100, 0, 0)
        await asyncio.sleep(10)
        machine.reset()
        while True:
            pass

    for coroutine in (connection_watch, mqtt_msg_handler):
        # noinspection PyAsyncCall
        asyncio.create_task(coroutine(client))
    while True:
        print('mqtt keepalive msg')
        # If Wi-Fi is down the following will pause for the duration.
        await client.publish('/keepalive', "", qos=0)
        await asyncio.sleep(3)


if __name__ == '__main__':

    # Local configuration
    config['ssid'] = SECRETS.WIFI_SSID
    config['wifi_pw'] = SECRETS.WIFI_PASSWORD
    config['server'] = SECRETS.MQTT_SERVER
    config['ssl'] = True
    config['user'] = SECRETS.MQTT_USER
    config['password'] = SECRETS.MQTT_PASSWORD
    config['ssl_params'] = {"server_hostname": SECRETS.MQTT_SERVER}

    config["queue_len"] = 1  # Use event interface with default queue size

    MQTTClient.DEBUG = True  # Optional: print diagnostic messages
    mqtt_client = MQTTClient(config)
    try:
        # noinspection PyUnresolvedReferences
        _thread.start_new_thread(led_thread_proc, [])
        asyncio.run(main(mqtt_client))
    finally:
        mqtt_client.close()  # Prevent LmacRxBlk:1 errors
