from machine import Pin, I2C
from ht16k33segment14 import HT16K33Segment14
import neopixel


class LedClass(object):
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(LedClass, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        self._led = neopixel.NeoPixel(Pin(2), 1)

    def set_color(self, r, g, b):
        self._led[0] = (r, g, b)
        self._led.write()


LED = LedClass()


class DisplayClass(object):

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(DisplayClass, cls).__new__(cls)
        return cls.instance

    def __init__(self):
        super().__init__()
        i2c = I2C(0, scl=Pin(0), sda=Pin(1))
        self._display = HT16K33Segment14(i2c)
        self._display.set_brightness(15)
        self._display.draw()

    def symbol(self, pos, glyph_str):
        glyph = 0
        for c in glyph_str:
            try:
                glyph |= self.SEGM14_GLYPHS[c]
            except KeyError:
                pass
        self._display.set_glyph(glyph=glyph, digit=pos)
        if pos == 2:
            self._display.set_decimal(glyph_str.find('.') >= 0)
            self._display.set_colon(glyph_str.find(':') >= 0)

    def clear(self):
        self._display.clear()

    def set_brightness(self, brightness):
        self._display.set_brightness(brightness)

    def text(self, text):
        self._display.clear()
        deci_dot = text.find(".") >= 0
        semicolon = text.find(":") >= 0
        text = text.replace(".", "").replace(":", "")
        for i in range(0, 4):
            c = text[i] if i < len(text) else ' '
            try:
                glyph_str = self.FONT[c]
            except Exception:
                glyph_str = ''
            if i == 2:
                if deci_dot:
                    glyph_str = glyph_str + "."
                if semicolon:
                    glyph_str = glyph_str + ":"
            self.symbol(i, glyph_str)
        self.draw()

    def draw(self):
        self._display.draw()

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


DISPLAY = DisplayClass()
