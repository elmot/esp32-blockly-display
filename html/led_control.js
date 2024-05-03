// noinspection JSUnusedGlobalSymbols
function segm16Output(pos, segments) {
    const inactiveColor = "#F0F0F0", activeColor = "#023FF7"
    const svg = document.getElementById("digit" + pos)
    if (svg == null) return
    for (let i = 0; i < 17; i++) {
        const segm = svg.getSVGDocument().querySelectorAll("g g")[i].querySelector("circle, polygon")
        const c = String.fromCharCode(i + 65)
        const color = segments.indexOf(c) >= 0 ? activeColor : inactiveColor
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
};

// noinspection JSUnusedGlobalSymbols
function segm16Text(text) {
    for (let i = 0; i < 4; i++) {
        const shape = font[text.charAt(i)]
        segm16Output(i, shape === undefined ? "" : shape)
    }
}