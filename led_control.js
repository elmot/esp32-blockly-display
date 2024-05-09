// noinspection JSUnusedGlobalSymbols
function segm14Output(pos, segments) {
    const inactiveColor = "#F0F0F0", activeColor = "#023FF7"
    const svg = document.getElementById("digit" + pos)
    if (svg == null) return
    for (let i = 0; i < 15; i++) {
        const segm = svg.getSVGDocument().querySelectorAll("g g")[i].querySelector("circle, polygon")
        const c = String.fromCharCode(i + 65)
        const color = segments.toUpperCase().indexOf(c) >= 0 ? activeColor : inactiveColor
        segm.style.fill = color
    }
}

const font = {
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
};


var stopMe = false
var runningTimeout = null

function segm14Stop()
{
    stopMe = true
    clearTimeout(runningTimeout)
}

function segm14StartScript() {
    const js = javascript.javascriptGenerator.workspaceToCode(workspace)
    segm14Stop()
    segm14Text("\s\s\s\s")
    const f = (async ()=>{}).constructor(js)
    setTimeout(() => {
        stopMe = false
        f()
    })
}
// noinspection JSUnusedGlobalSymbols
function segm14Text(text) {
    if(stopMe) {
        return
    }
    for (let i = 0; i < 4; i++) {
        const shape = font[text.charAt(i)]
        segm14Output(i, shape === undefined ? "" : shape)
    }
}

// noinspection JSUnusedGlobalSymbols
function segm14Delay(ms) {
    if(stopMe) {
        return null
    }
    return new Promise(resolve => runningTimeout = setTimeout(resolve, ms * 1000.0));
}

