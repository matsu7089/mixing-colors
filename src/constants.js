export const SCREEN = {
  W: 640,
  H: 960,
}

export const FONT = "'M PLUS Rounded 1c', sans-serif"

// prettier-ignore
const cyan    = { c: 1, m: 0, y: 0 },
      magenta = { c: 0, m: 1, y: 0 },
      yellow  = { c: 0, m: 0, y: 1 },
      red     = { c: 0, m: 1, y: 1 },
      green   = { c: 1, m: 0, y: 1 },
      blue    = { c: 1, m: 1, y: 0 },
      white   = { c: 0, m: 0, y: 0 }

export const BASE_COLOR = {
  CYAN: cyan,
  MAGENTA: magenta,
  YELLOW: yellow,
  RED: red,
  GREEN: green,
  BLUE: blue,
  WHITE: white,
}

// prettier-ignore
export const MIXED_COLORS = [
  [cyan, magenta],   // 110
  [blue, white],     // 110
  [magenta, yellow], // 011
  [red, white],      // 011
  [yellow, cyan],    // 101
  [green, white],    // 101
  [cyan, green],     // 201
  [cyan, blue],      // 210
  [magenta, red],    // 021
  [magenta, blue],   // 120
  [yellow, red],     // 012
  [yellow, green],   // 102
  [cyan, magenta, magenta],   // 120
  [magenta, blue, white],     // 120
  [cyan, yellow, yellow],     // 102
  [yellow, green, white],     // 102
  [magenta, cyan, cyan],      // 210
  [cyan, blue, white],        // 210
  [magenta, yellow, yellow],  // 012
  [yellow, red, white],       // 012
  [yellow, cyan, cyan],       // 201
  [cyan, green, white],       // 201
  [yellow, magenta, magenta], // 021
  [magenta, red, white],      // 021
]
