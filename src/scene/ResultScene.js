import phina from 'phina.js'
import { TitleScene } from '.'
import { FONT, MIXED_COLORS, SCREEN } from '../constants'

import { Wave } from '../effect/'

import { cmyToRgb } from '../utils'

export default phina.define('mc.scene.ResultScene', {
  superClass: phina.display.DisplayScene,

  init(options) {
    this.superInit(options)

    const color = cmyToRgb(MIXED_COLORS.pickup())
    this.backgroundColor = color

    const layer = phina.display
      .CanvasLayer({
        width: SCREEN.W,
        heigth: SCREEN.H,
      })
      .setOrigin(0, 0)
      .addChildTo(this)

    layer.backgroundColor = 'rgba(0, 0, 0, 0.5)'

    // MainSceneから渡されるデータ
    const { level, time, hintCnt } = options

    const targetTime = level * 3 * 60000
    const score = Math.floor((targetTime / (time + hintCnt * 30000)) * 1000)

    const timeToString = (time) => {
      const sec = Math.floor(time / 1000)
      const min = Math.floor(sec / 60)
      return min.padding(2, '0') + ':' + (sec % 60).padding(2, '0')
    }

    const text = [
      `Result`,
      ``,
      `level:  ${level}`,
      ``,
      `time:  ${timeToString(time)}`,
      `hint x ${hintCnt}`,
      `────────`,
      `score:  ${score}`,
    ].join('\n')

    phina.display
      .Label({
        text,
        fill: '#fff',
        fontFamily: FONT.DEFAULT,
        stroke: false,
        fontSize: 48,
        fontWeight: '700',
        x: this.gridX.center(),
        y: this.gridY.span(5),
      })
      .addChildTo(this)

    const buttonOptions = {
      fill: false,
      stroke: '#fff',
      strokeWidth: 4,
      fontColor: '#fff',
      fontFamily: FONT.DEFAULT,
      fontWeight: '700',
      x: this.gridX.center(),
    }

    const tweetButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'ツイート',
        y: this.gridY.span(12),
      })
      .addChildTo(this)

    const titleButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'タイトルへ',
        y: this.gridY.span(14),
      })
      .addChildTo(this)

    titleButton.on('click', () => {
      this.app.replaceScene(TitleScene())
    })

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
