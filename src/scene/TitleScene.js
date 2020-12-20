import phina from 'phina.js'
import Matter from 'matter-js'
import { SCREEN, COLOR, MIXED_COLORS, FONT } from '../constants'

import { MatterLayer } from '../matter/'
import { MtRectangle, MtCircle, MtTriangle } from '../display/'
import { HowToScene, MainScene } from '../scene/'

export default phina.define('mc.scene.TitleScene', {
  superClass: phina.display.DisplayScene,

  init(options) {
    this.superInit(options)

    this.backgroundColor = COLOR.BASE
    this.mtLayer = MatterLayer().addChildTo(this)
    this.mtLayer.mtWorld.gravity.y = 0

    this._createWall()

    for (let i = 0; i < 10; i++) {
      const options = {
        cmyList: MIXED_COLORS.pickup(),
      }

      let shape
      switch (Math.randint(0, 2)) {
        case 0:
          shape = MtRectangle(options)
          break
        case 1:
          shape = MtCircle(options)
          break
        case 2:
          shape = MtTriangle(options)
          break
      }

      shape.addChildTo(this.mtLayer).mtSetPosition({ x: SCREEN.W / 2, y: SCREEN.H / 2 })
      shape.mtSetAngularVelocity(Math.randfloat(-0.5, 0.5))
    }

    const layer = phina.display
      .CanvasLayer({
        width: SCREEN.W,
        heigth: SCREEN.H,
      })
      .setOrigin(0, 0)
      .addChildTo(this)

    layer.backgroundColor = 'rgba(0, 0, 0, 0.5)'

    phina.display
      .Label({
        text: 'いろづくり',
        fontSize: 72,
        fontFamily: FONT.DEFAULT,
        fontWeight: '700',
        fill: '#fff',
        stroke: false,
        strokeWidth: 18,
        y: this.gridY.span(3),
        x: SCREEN.W / 2,
      })
      .addChildTo(this)

    const buttonOptions = {
      fill: false,
      stroke: '#fff',
      strokeWidth: 4,
      fontColor: '#fff',
      fontFamily: FONT.DEFAULT,
      fontWeight: '700',
    }

    const startButton = phina.ui
      .Button({
        ...buttonOptions,
        text: 'スタート',
        x: this.gridX.center(),
        y: this.gridY.span(12),
      })
      .addChildTo(this)

    const howtoButton = phina.ui
      .Button({
        ...buttonOptions,
        text: '遊び方',
        x: this.gridX.center(),
        y: this.gridY.span(14),
      })
      .addChildTo(this)

    phina.display
      .Label({
        text: 'レベル',
        fontSize: 48,
        fontFamily: FONT.DEFAULT,
        fontWeight: '700',
        fill: '#fff',
        stroke: false,
        x: this.gridX.center(),
        y: this.gridY.span(6),
      })
      .addChildTo(this)

    const levelLabel = phina.display
      .Label({
        text: '1',
        fontSize: 72,
        fontFamily: FONT.DEFAULT,
        fontWeight: '700',
        fill: '#fff',
        stroke: false,
        strokeWidth: 18,
        x: this.gridX.center(),
        y: this.gridY.center(),
      })
      .addChildTo(this)

    const leftButton = phina.ui
      .Button({
        ...buttonOptions,
        width: 100,
        height: 100,
        text: '◀',
        x: this.gridX.span(4),
        y: this.gridY.center(),
      })
      .addChildTo(this)

    const rightButton = phina.ui
      .Button({
        ...buttonOptions,
        width: 100,
        height: 100,
        text: '▶',
        x: this.gridX.span(12),
        y: this.gridY.center(),
      })
      .addChildTo(this)

    let level = 1

    leftButton.on('click', () => {
      level--
      if (level === 0) {
        level = 3
      }
      levelLabel.text = level
    })

    rightButton.on('click', () => {
      level++
      if (level === 4) {
        level = 1
      }
      levelLabel.text = level
    })

    startButton.on('click', () => {
      this.app.replaceScene(
        MainScene({
          level,
        })
      )
    })

    howtoButton.on('click', () => {
      this.app.pushScene(HowToScene())
    })
  },

  _createWall() {
    const size = 1000

    const options = {
      isStatic: true,
    }

    Matter.World.add(this.mtLayer.mtWorld, [
      // top
      Matter.Bodies.rectangle(SCREEN.W / 2, -size / 2, SCREEN.W + size * 2, size, options),
      // bottom
      Matter.Bodies.rectangle(SCREEN.W / 2, SCREEN.H + size / 2, SCREEN.W + size * 2, size, options),
      // left
      Matter.Bodies.rectangle(-size / 2, SCREEN.H / 2, size, SCREEN.H + size * 2, options),
      // right
      Matter.Bodies.rectangle(SCREEN.W + size / 2, SCREEN.H / 2, size, SCREEN.H + size * 2, options),
    ])
  },
})
