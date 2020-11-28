import phina from 'phina.js'
import Matter from 'matter-js'

import Shape from './Shape'

export default phina.define('mc.display.RectangleShape', {
  superClass: Shape,

  init(options) {
    options = {}.$safe(options, {
      backgroundColor: 'transparent',
      fill: 'blue',
      stroke: 'transparent',
      cornerRadius: 0,
    })
    this.superInit(options)

    this.cornerRadius = options.cornerRadius

    this.mtBody = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
      restitution: 0.5,
    })
    this.mtSetAngle(this.rotation * Math.DEG_TO_RAD)

    // mtBodyから自分にアクセスできるようにする
    this.mtBody.plugin.mcObject = this

    // mtBodyと同期
    this.on('enterframe', (e) => {
      this.x = this.mtBody.position.x
      this.y = this.mtBody.position.y
      this.rotation = this.mtBody.angle * Math.RAD_TO_DEG
    })
  },

  /**
   * @see phina.display.RectangleShape
   */
  prerender(canvas) {
    canvas.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.cornerRadius)
  },
})
