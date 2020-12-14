import phina from 'phina.js'
import { FONT, MIXED_COLORS, SCREEN } from '../constants'

import { Wave } from '../effect/'

import { cmyToRgb } from '../utils'

export default phina.define('mc.scene.ResultScene', {
  superClass: phina.display.DisplayScene,

  init(options) {
    this.superInit(options)

    this.backgroundColor = '#eee'

    // MainSceneから渡されるデータ
    const { level, time, hintCnt } = options
    const total = time + 30000 * hintCnt

    const timeToString = (time) => {
      const sec = Math.floor(time / 1000)
      const min = Math.floor(sec / 60)
      return min.padding(2, '0') + ':' + (sec % 60).padding(2, '0')
    }

    const text = [
      `Result`,
      ``,
      `time:  ${timeToString(time)}`,
      `hint:  00:30 x ${hintCnt}`,
      `────────`,
      `level:  ${level}`,
      `total:  ${timeToString(total)}`,
    ].join('\n')

    phina.display
      .Label({
        text,
        fill: '#888',
        fontFamily: FONT.DEFAULT,
        stroke: 'transparent',
        fontSize: 48,
        fontWeight: '300',
        x: this.gridX.center(),
        y: this.gridY.span(5),
      })
      .addChildTo(this)

    const buttonOptions = {
      fill: 'transparent',
      stroke: '#888',
      strokeWidth: 2,
      fontColor: '#888',
      fontFamily: FONT.DEFAULT,
      fontWeight: '300',
      x: this.gridX.center(),
    }

    const tweetButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'ツイート',
        y: this.gridY.span(11),
      })
      .addChildTo(this)

    const titleButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'タイトルへ',
        y: this.gridY.span(13),
      })
      .addChildTo(this)

    const createEffect = () => {
      const cmyList = MIXED_COLORS.pickup()
      const x = Math.randint(0, SCREEN.W)
      const y = Math.randint(0, SCREEN.H)
      Wave(cmyToRgb(cmyList), { x, y }).addChildTo(this)
    }

    this.tweener
      .call(createEffect)
      .wait(100)
      .call(createEffect)
      .wait(100)
      .call(createEffect)
      .wait(100)
      .call(createEffect)
      .wait(100)
      .call(createEffect)
      .wait(1000)
      .setLoop(true)
  },
})
