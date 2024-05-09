# IMPORTS
import utime as time
from machine import I2C, Pin, Timer
import neopixel

import secrets
from ht16k33segment14 import HT16K33Segment14

import network
from umqtt.simple import MQTTClient

# CONSTANTS
DELAY = 0.3
PAUSE = 3
LAST_CODE_PY = 'last_code.py'


class CancelException(Exception):
    pass


FONT = {
    ' ': '',
    '.': 'o',
    'A': 'EFABCGH',
    'B': 'ABCDJHM',
    'C': 'EFAD',
    'D': 'ABCDJM',
    'E': 'EFADG',
    'F': 'EFAG',
    'G': 'EFACDH',
    'H': 'EFBCGH',
    'I': 'ADJM',
    'J': 'EBCD',
    'K': 'EFGKL',
    'L': 'EFD',
    'M': 'EFBCIK',
    'N': 'EFBCIL',
    'O': 'EFABCD',
    'P': 'EFABGH',
    'Q': 'EFABCDL',
    'R': 'EFABGHL',
    'S': 'ACDIH',
    'T': 'AJM',
    'U': 'EFBCD',
    'V': 'EFNK',
    'W': 'EFBCNL',
    'X': 'NIKL',
    'Y': 'FBGHM',
    'Z': 'ADNK',
    '0': 'EFABCD',
    '1': 'BC',
    '2': 'EABDGH',
    '3': 'ABCDHG',
    '4': 'FBCGH',
    '5': 'FACDGH',
    '6': 'EFACDGH',
    '7': 'ABC',
    '8': 'EFABCDGH',
    '9': 'FABCDGH',
    '+': 'GJHM',
    '-': 'GH',
    '=': 'DGH',
    '~': 'A',
    '_': 'D',
    '[': 'EFAD',
    ']': 'ABCD',
    '>': 'NI',
    '<': 'KL',
    '|': 'JM',
    '/': 'NK',
    '\\': 'IL',
    '*': 'NGIJKHLM',
    '$': 'FACDGJHM',
    'Й': 'EFABCNK',
    'Ц': 'EFBCDL',
    'У': 'NIK',
    'К': 'EFGKL',
    'Е': 'EFADG',
    'Н': 'EFBCGH',
    'Г': 'EFA',
    'Ш': 'EFBCDJM',
    'Щ': 'FBCGJH',
    'З': 'ABCDGH',
    'Х': 'NIKL',
    'Ъ': 'ACDJHM',
    'Ф': 'FABGJHM',
    'Ы': 'EFBChGM',
    'В': 'EFABCDGH',
    'А': 'EFABCGH',
    'П': 'EFABC',
    'Р': 'EFABGH',
    'О': 'EFABCD',
    'Л': 'BCNK',
    'Д': 'BCDNK',
    'Ж': 'NGIJKHLM',
    'Э': 'NGI',
    'Я': 'FABCNGH',
    'Ч': 'FBCGH',
    'С': 'EFAD',
    'М': 'EFBCIK',
    'И': 'EFBCNK',
    'Т': 'AJM',
    'Ь': 'EFCDGH',
    'Б': 'EFACDGH',
    'Ю': 'EFBCGKL',
}

SEGM14_GLYPHS = {
    "A": 0x1,
    "B": 0x2,
    "C": 0x4,
    "D": 0x8,
    "E": 0x10,
    "F": 0x20,
    "G": 0x40,
    "H": 0x80,
    "I": 0x100,
    "J": 0x200,
    "K": 0x400,
    "L": 0x800,
    "M": 0x1000,
    "N": 0x2000,
}

# Global variables
text_to_run = None
client = None


def mqtt_ping(_):
    client.publish("/" + secrets.MQTT_TOKEN + "/keepalive", b"ping")
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
    display.clear()
    for i in range(0, 4):
        c = text[i] if i < len(text) else ' '
        try:
            glyph_str = FONT[c]
        except CancelException:
            glyph_str = ''
        segm14_symbol(i, glyph_str)
    segm14_check_msg()
    display.draw()


def segm14_symbol(pos, glyph_str):
    glyph = 0
    for c in glyph_str:
        glyph |= SEGM14_GLYPHS[c]
    segm14_check_msg()
    display.set_glyph(glyph=glyph, digit=pos)


def segm14_output(pos, glyph_str):
    segm14_symbol(pos, glyph_str)
    display.draw()


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
        print(text)
        f.close()
        global text_to_run
        text_to_run = text
    except Exception as _:
        pass


def run_text():
    global text_to_run
    if text_to_run is not None:
        display.clear()
        display.draw()
        text = text_to_run
        text_to_run = None
        try:
            exec(text)
        except CancelException:
            pass


# START
if __name__ == '__main__':
    i2c = I2C(0, scl=Pin(0), sda=Pin(1))  # Raspberry Pi Pico

    display = HT16K33Segment14(i2c)
    display.set_brightness(15)
    display.clear()
    display.draw()

    led = neopixel.NeoPixel(Pin(2), 1)
    print("Starting wifi")

    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    sta_if.connect(secrets.WIFI_SSID, secrets.WIFI_PASSWORD)
    conn_retry = 50
    while conn_retry > 0 and not sta_if.isconnected():
        led[0] = (0, 0, 100)
        led.write()
        time.sleep_ms(500)
        led[0] = (0, 0, 20)
        led.write()
        time.sleep_ms(500)
        conn_retry -= 1
    if conn_retry <= 0:
        led[0] = (50, 0, 0)
        led.write()
        segm14_restart()
        run_text()
        while True:
            pass

    led[0] = (0, 0, 50)
    led.write()
    print("Connecting to MQTT")

    client = MQTTClient(client_id=b"dimon-board1",
                        server=secrets.MQTT_SERVER,
                        port=secrets.MQTT_PORT,
                        ssl=secrets.MQTT_SSL,
                        keepalive=60
                        )
    client.set_callback(mqtt_msg_handler)
    client.connect()
    client.subscribe(("/" + secrets.MQTT_TOKEN + "/python/#").encode())

    led[0] = (0, 20, 0)
    led.write()
    mqtt_ping(None)
    keepAliveTimer = Timer(0)
    keepAliveTimer.init(mode=Timer.PERIODIC, period=4000, callback=mqtt_ping)
    segm14_restart()
    while True:
        client.check_msg()
        run_text()
