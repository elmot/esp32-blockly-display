// noinspection JSUnusedGlobalSymbols
function segm14Output(pos, segments) {
    const inactiveColor = "#F0F0F0", activeColor = "#023FF7"
    const svg = document.getElementById("digit" + pos)?.getSVGDocument()
    segments = String(segments)
    if (svg == null) return
    for (let i = 0; i < 14; i++) {
        const segm = svg.querySelectorAll("polygon")[i]
        const c = String.fromCharCode(i + 65)
        const color = segments.toUpperCase().indexOf(c) >= 0 ? activeColor : inactiveColor
        segm.style.fill = color
    }
    if (pos === 2) {
        svg.querySelector("#dec_dot").style.fill = segments.indexOf(".") >= 0 ? activeColor : inactiveColor
        svg.querySelector("#semicolon").style.fill = segments.indexOf(":") >= 0 ? activeColor : inactiveColor
    }
}

const font = {
    ' ': '',
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


function segm14StartScript() {
    if (this !== window) {
        segm14StartScript.call(window)
        return
    }
    segm14Text("\s\s\s\s")
    window.stopMe = true
    clearTimeout(window.runningTimeout)
    const js = javascript.javascriptGenerator.workspaceToCode(workspace)
    //Tricky stuff: here we create an async function using browser internal constructor
    const f = (async () => {
    }).constructor(js)
    setTimeout(() => {
        window.stopMe = false
        f()
    }, 100)
}

// noinspection JSUnusedGlobalSymbols
function segm14Text(text) {
    text = String(text)
    const digitalDot = text.indexOf(".") >= 0
    const semicolon = text.indexOf(":") >= 0
    for (let i = 0, digitIdx = 0; digitIdx < 4; i++) {
        if (window.stopMe) {
            return
        }
        const c = text.charAt(i)
        if (c === "." || c === ":") {
            continue
        }
        let shape = font[c] === undefined ? "" : font[c]
        if (digitIdx === 2 ) {
            if(digitalDot) shape += "."
            if(semicolon) shape += ":"
        }
        segm14Output(digitIdx, shape)
        digitIdx++
    }
}

// noinspection JSUnusedGlobalSymbols
function segm14Delay(ms) {
    if (window.stopMe) {
        return null
    }
    return new Promise(resolve => {
        if (!window.stopMe) window.runningTimeout = setTimeout(resolve, ms * 1000.0)
    });
}

