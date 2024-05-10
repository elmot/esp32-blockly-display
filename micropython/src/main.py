# IMPORTS
import utime as time
from machine import Timer

import SECRETS

import network
from umqtt.simple import MQTTClient

from hw import LED, DISPLAY

# CONSTANTS
LAST_CODE_PY = 'last_code.py'


class CancelException(Exception):
    pass


# Global variables
text_to_run = None
client = None


def mqtt_ping(_):
    client.publish("/" + SECRETS.MQTT_TOKEN + "/keepalive", b"ping")
    print("mqtt ping")


def mqtt_msg_handler(topic, message):
    msg_text = message.decode()
    if topic.endswith("/python/run"):
        print("python code to run arrived")
        f = open(LAST_CODE_PY, 'w')
        f.write(msg_text)
        f.close()
        global text_to_run
        text_to_run = msg_text
    elif topic.endswith("/python/restart"):
        print("python code restart")
        segm14_restart()
    else:
        print("Unexpected message to " + topic + ": " + msg_text)


def segm14_check_msg():
    if client is None:
        return
    if not client.check_msg() is None:
        raise CancelException("Message arrived")


def segm14_text(text):
    segm14_check_msg()
    DISPLAY.text(text)


def segm14_symbol(pos, glyph_str):
    segm14_check_msg()
    DISPLAY.symbol(pos, glyph_str)


def segm14_output(pos, glyph_str):
    segm14_symbol(pos, glyph_str)
    DISPLAY.draw()


def segm14_delay(time_sec):
    while time_sec > 0:
        s = time_sec if time_sec < 0.1 else 0.1
        segm14_check_msg()
        time.sleep_ms(int(s * 1000))
        time_sec -= s


def segm14_restart():
    try:
        f = open(LAST_CODE_PY, 'r')
        text = f.read()
        f.close()
        global text_to_run
        text_to_run = text
    except Exception as _:
        pass


def run_text():
    global text_to_run
    if text_to_run is not None:
        DISPLAY.clear()
        DISPLAY.draw()
        text = text_to_run
        text_to_run = None
        try:
            exec(text)
        except CancelException:
            pass


# START
if __name__ == '__main__':

    DISPLAY.set_brightness(15)
    DISPLAY.clear()
    DISPLAY.draw()

    print("Starting wifi")

    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    sta_if.connect(SECRETS.WIFI_SSID, SECRETS.WIFI_PASSWORD)
    conn_retry = 50
    while conn_retry > 0 and not sta_if.isconnected():
        LED.set_color(0, 0, 100)
        time.sleep_ms(500)
        LED.set_color(0, 0, 20)
        time.sleep_ms(500)
        conn_retry -= 1
    if conn_retry <= 0:
        LED.set_color(50, 0, 0)
        segm14_restart()
        run_text()
        while True:
            pass

    LED.set_color(0, 0, 50)
    print("Connecting to MQTT")

    client = MQTTClient(client_id=b"dimon-board1",
                        server=SECRETS.MQTT_SERVER,
                        port=SECRETS.MQTT_PORT,
                        ssl=SECRETS.MQTT_SSL,
                        keepalive=60
                        )
    client.set_callback(mqtt_msg_handler)
    client.connect()
    client.subscribe(("/" + SECRETS.MQTT_TOKEN + "/python/#").encode())

    LED.set_color(0, 20, 0)
    mqtt_ping(None)
    keepAliveTimer = Timer(0)
    keepAliveTimer.init(mode=Timer.PERIODIC, period=4000, callback=mqtt_ping)
    segm14_restart()
    while True:
        client.check_msg()
        run_text()
