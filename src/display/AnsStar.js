import phina from 'phina.js'

import { cmyToRgb } from '../utils'

export default phina.define('mc.display.AnsStar', {
  superClass: phina.display.StarShape,

  cmyList: null,
  ansColor: null,
  isClicked: null,
  _isCorrect: null,

  init(options) {
    const ansColor = cmyToRgb(options.cmyList)
    options = {}.$safe(options, {
      padding: 20,
      radius: 38,
      sideIndent: 0.5,
      fill: '#fff',
      strokeWidth: 20,
      stroke: ansColor,
    })

    this.superInit(options)

    this.cmyList = options.cmyList
    this.ansColor = ansColor
    this.isClicked = false

    this._isCorrect = false

    this.setInteractive(true)
    this.on('click', (e) => {
      this._onClick(e)
    })
  },

  _onClick(e) {
    if (this.isClicked) return
    this.isClicked = true

    const len = this.cmyList.length
    const offsetX = (len - 1) * 15

    this.cmyList.forEach((cmy, i) => {
      phina.display
        .StarShape({
          radius: 15,
          sideIndent: 0.5,
          fill: cmyToRgb([cmy]),
          strokeWidth: 8,
          stroke: '#eee',
          x: 30 * i - offsetX,
          y: 45,
        })
        .addChildTo(this)
    })
  },

  _accessor: {
    isCorrect: {
      get() {
        return this._isCorrect
      },
      set(v) {
        if (v === this._isCorrect) return
        this._isCorrect = v

        if (this._isCorrect) {
          this.fill = this.ansColor
        } else {
          this.fill = '#fff'
        }
      },
    },
  },
})
