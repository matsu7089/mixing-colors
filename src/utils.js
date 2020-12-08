/**
 * cmy同士の足し算の結果を返します
 * @param {cmy[]} cmyList
 * @returns {cmy} cmy
 */
export const cmySum = (cmyList) => {
  return cmyList.reduce(
    (a, c) => {
      return {
        c: a.c + c.c,
        m: a.m + c.m,
        y: a.y + c.y,
      }
    },
    { c: 0, m: 0, y: 0 }
  )
}

/**
 * cmyList同士を比較して同じ色か確認します
 * @param {cmy[]} cmyListA
 * @param {cmy[]} cmyListB
 * @returns {boolean} exact
 */
export const cmyExact = (cmyListA, cmyListB) => {
  if (cmyListA.length !== cmyListB.length) return false

  const cmyA = cmySum(cmyListA)
  const cmyB = cmySum(cmyListB)
  return cmyA.c === cmyB.c && cmyA.m === cmyB.m && cmyA.y === cmyB.y
}

/**
 * cmyListからrgbの形式に変換します
 * @param {cmy[]} cmyList
 * @returns {string} rgb
 */
export const cmyToRgb = (cmyList) => {
  const cmy = cmySum(cmyList)

  const len = cmyList.length
  const c = (cmy.c / len) * 0.7
  const m = (cmy.m / len) * 0.7
  const y = (cmy.y / len) * 0.7

  const r = Math.floor((1 - c) * 255)
  const g = Math.floor((1 - m) * 255)
  const b = Math.floor((1 - y) * 255)

  return `rgb(${r}, ${g}, ${b})`
}
