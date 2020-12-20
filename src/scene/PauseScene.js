import phina from 'phina.js'

import { FONT } from '../constants'
import TitleScene from './TitleScene'

export default phina.define('mc.scene.PauseScene', {
  superClass: phina.display.DisplayScene,

  init(options) {
    this.superInit(options)

    this.backgroundColor = '#eee'

    phina.display
      .Label({
        text: 'Pause',
        fill: '#888',
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
      stroke: '#888',
      strokeWidth: 4,
      fontColor: '#888',
      fontFamily: FONT.DEFAULT,
      fontWeight: '700',
      x: this.gridX.center(),
    }

    const resumeButton = phina.ui
      .Button({
        ...buttonOptions,
        text: '再開',
        y: this.gridY.span(9),
      })
      .addChildTo(this)

    const titleButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'タイトルへ',
        y: this.gridY.span(11),
      })
      .addChildTo(this)

    resumeButton.on('click', (e) => {
      this.exit()
    })

    titleButton.on('click', (e) => {
      this.app.replaceScene(TitleScene())
    })
  },
})
