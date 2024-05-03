// noinspection JSUnusedGlobalSymbols
function segm16Output(pos, segments) {
    const inactiveColor = "#F0F0F0", activeColor = "#023FF7"
    const svg = document.getElementById("digit" + pos)
    if (svg == null) return
    for (let i = 0; i < 17; i++) {
        const segm = svg.getSVGDocument().querySelectorAll("g g")[i].querySelector("circle, polygon")
        const c = String.fromCharCode(i + 65)
        const color = segments.toUpperCase().indexOf(c) >= 0 ? activeColor : inactiveColor
        segm.style.fill = color
    }
}

const font = {
    ' ': '',
    '.': 'Q',
    'A': 'ABCDEFJN',
    'B': 'CDEFGHLNP',
    'C': 'ABCDGH',
    'D': 'CDEFGHLP',
    'E': 'ABCDGHJ',
    'F': 'ABCDJ',
    'G': 'ABCDFGHN',
    'H': 'ABEFJN',
    'I': 'CDGHLP',
    'J': 'AEFGH',
    'K': 'ABJMO',
    'L': 'ABGH',
    'M': 'ABEFKM',
    'N': 'ABEFKO',
    'O': 'ABCDEFGH',
    'P': 'ABCDEJN',
    'Q': 'ABCDEFGHO',
    'R': 'ABCDEJNO',
    'S': 'CDFGHKN',
    'T': 'CDLP',
    'U': 'ABEFGH',
    'V': 'ABIM',
    'W': 'ABEFIO',
    'X': 'IKMO',
    'Y': 'BEJNP',
    'Z': 'CDGHIM',
    '0': 'ABCDEFGH',
    '1': 'EF',
    '2': 'ACDEGHJN',
    '3': 'CDEFGHNJ',
    '4': 'BEFJN',
    '5': 'BCDFGHJN',
    '6': 'ABCDFGHJN',
    '7': 'CDEF',
    '8': 'ABCDEFGHJN',
    '9': 'BCDEFGHJN',
    '+': 'JLNP',
    '-': 'JN',
    '_': 'GH',
    '[': 'ABCH',
    ']': 'DEFG',
    '>': 'IK',
    '<': 'MO',
    '|': 'LP',
    '/': 'IM',
    '\\': 'KO',
    '*': 'IJKLMNOP',
    '$': 'BCDFGHJLNP',
    'Й': 'ABDEFIM',
    'Ц': 'ABEFGHO',
    'У': 'IKM',
    'К': 'ABJMO',
    'Е': 'ABCDGHJ',
    'Н': 'ABEFJN',
    'Г': 'ABCD',
    'Ш': 'ABEFGHLP',
    'Щ': 'BEFJLN',
    'З': 'CDEFGHJN',
    'Х': 'IKMO',
    'Ъ': 'CFGLNP',
    'Ф': 'BCDEJLNP',
    'Ы': 'ABEFHJP',
    'В': 'ABCDEFGHJN',
    'А': 'ABCDEFJN',
    'П': 'ABCDEF',
    'Р': 'ABCDEJN',
    'О': 'ABCDEFGH',
    'Л': 'EFIM',
    'Д': 'EFGHIM',
    'Ж': 'IJKLMNOP',
    'Э': 'IJK',
    'Я': 'BCDEFIJN',
    'Ч': 'BEFJN',
    'С': 'ABCDGH',
    'М': 'ABEFKM',
    'И': 'ABEFIM',
    'Т': 'CDLP',
    'Ь': 'ABFGHJN',
    'Б': 'ABCDFGHJN',
    'Ю': 'ABDEFGJLP',
};
М
// noinspection JSUnusedGlobalSymbols
function segm16Text(text) {
    for (let i = 0; i < 4; i++) {
        const shape = font[text.charAt(i)]
        segm16Output(i, shape === undefined ? "" : shape)
    }
}