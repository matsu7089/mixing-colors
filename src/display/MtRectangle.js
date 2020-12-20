import phina from 'phina.js'
import Matter from 'matter-js'

import MtShape from './MtShape'

export default phina.define('mc.display.MtRectangle', {
  superClass: MtShape,

  init(options) {
    options = {}.$safe(options, {
      width: 100,
      height: 100,
      backgroundColor: 'transparent',
      fill: 'blue',
      stroke: false,
      cornerRadius: 0,
    })
    this.superInit(options)

    this.cornerRadius = options.cornerRadius

    this.mtBody = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      restitution: 0.5,
    })
    this.mtSetAngle(this.rotation * Math.DEG_TO_RAD)
    this.mtSetLabel('rectangle')

    // mtBodyから自分にアクセスできるようにする
    this.mtBody.plugin.mcObject = this

    if (!options.unsync) {
      // mtBodyと同期
      this.on('enterframe', (e) => {
        this.x = this.mtBody.position.x
        this.y = this.mtBody.position.y
        this.rotation = this.mtBody.angle * Math.RAD_TO_DEG
      })
    }
  },

  /**
   * @see phina.display.RectangleShape
   */
  prerender(canvas) {
    canvas.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.cornerRadius)
  },
})
