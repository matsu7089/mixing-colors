import phina from 'phina.js'
import { SCREEN } from '../constants'

import { MatterLayer } from '../matter/'
import { CircleShape, RectangleShape, TriangleShape } from '../display/'

export default phina.define('mc.scene.MainScene', {
  superClass: phina.display.DisplayScene,

  /** MatterLayer */
  mtLayer: null,

  init(options) {
    this.superInit(options)

    this.mtLayer = MatterLayer({
      width: SCREEN.W,
      height: SCREEN.H,
    }).addChildTo(this)

    this.mtLayer.mtWorld.gravity.y = 0

    this._createWall()
  },

  _createWall() {
    const size = 500

    const walls = [
      // top
      RectangleShape({
        x: SCREEN.W / 2,
        y: -size / 2,
        width: SCREEN.W + size * 2,
        height: size,
      }),
      // bottom
      RectangleShape({
        x: SCREEN.W / 2,
        y: SCREEN.H + size / 2,
        width: SCREEN.W + size * 2,
        height: size,
      }),
      // left
      RectangleShape({
        x: -size / 2,
        y: SCREEN.H / 2,
        width: size,
        height: SCREEN.H + size * 2,
      }),
      // right
      RectangleShape({
        x: SCREEN.W + size / 2,
        y: SCREEN.H / 2,
        width: size,
        height: SCREEN.H + size * 2,
      }),
    ]

    walls.forEach((wall) => {
      wall.mtSetStatic(true)

      wall.addChildTo(this.mtLayer)
      wall.setVisible(false)
    })
  },
})
