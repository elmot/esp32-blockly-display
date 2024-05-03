
const font = {
    ' ': [],
    '.': [16],
    'A': [0, 1, 2, 3, 4, 5, 9, 13],
    'B': [2, 3, 4, 5, 6, 7, 11, 13, 15],
    'C': [0, 1, 2, 3, 6, 7],
    'D': [2, 3, 4, 5, 6, 7, 11, 15],
    'E': [0, 1, 2, 3, 6, 7, 9],
    'F': [0, 1, 2, 3, 9],
    'G': [0, 1, 2, 3, 5, 6, 7, 13],
    'H': [0, 1, 4, 5, 9, 13],
    'I': [2, 3, 6, 7, 11, 15],
    'J': [0, 4, 5, 6, 7],
    'K': [0, 1, 9, 12, 14],
    'L': [0, 1, 6, 7],
    'M': [0, 1, 4, 5, 10, 12 ],
    'N': [0, 1, 4, 5, 10, 14],
    'O': [0, 1, 2, 3, 4, 5, 6, 7],
    'P': [0, 1, 2, 3, 4, 9, 13],
    'Q': [0, 1, 2, 3, 4, 5, 6, 7, 14],
    'R': [0, 1, 2, 3, 4, 9, 13, 14],
    'S': [2, 3, 5, 6, 7, 10, 13],
    'T': [2, 3, 11, 15],
    'U': [0, 1, 4, 5, 6, 7],
    'V': [0, 1, 8, 12],
    'W': [0, 1, 4, 5, 8, 14],
    'X': [8, 10, 12, 14],
    'Y': [1, 4, 9, 13, 15],
    'Z': [2, 3, 6, 7, 8, 12],
    'CURL1': [0, 1, 2, 10, 11],
    'CURL2': [1, 2, 3, 4, 12, 13],
    'CURL3': [4, 5, 6, 14, 15],
    'CURL4': [0, 5, 6, 7, 8, 9],
};
for( b in font) {
    let s = ""
    let letter = font[b]
    for(let c in letter) {
        s+= String.fromCharCode(65 + letter[c])
    }
    s+=""
    console.log(`'${b}': '${s}',`)

}
