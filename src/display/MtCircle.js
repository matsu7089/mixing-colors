import phina from 'phina.js'
import Matter from 'matter-js'

import MtShape from './MtShape'

export default phina.define('mc.display.MtCircle', {
  superClass: MtShape,

  init(options) {
    options = {}.$safe(options, {
      backgroundColor: 'transparent',
      fill: 'red',
      stroke: false,
      radius: 56,
    })
    this.superInit(options)

    this.setBoundingType('circle')

    this.mtBody = Matter.Bodies.circle(this.x, this.y, this.radius, {
      restitution: 0.5,
    })
    this.mtSetAngle(this.rotation * Math.DEG_TO_RAD)
    this.mtSetLabel('circle')

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
   * @see phina.display.CircleShape
   */
  prerender(canvas) {
    canvas.circle(0, 0, this.radius)
  },
})
