import phina from 'phina.js'
import Matter from 'matter-js'

import Shape from './Shape'

export default phina.define('mc.display.CircleShape', {
  superClass: Shape,

  init(options) {
    options = {}.$safe(options, {
      backgroundColor: 'transparent',
      fill: 'red',
      stroke: 'transparent',
      radius: 32,
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

    // mtBodyと同期
    this.on('enterframe', (e) => {
      this.x = this.mtBody.position.x
      this.y = this.mtBody.position.y
      this.rotation = this.mtBody.angle * Math.RAD_TO_DEG
    })
  },

  /**
   * @see phina.display.CircleShape
   */
  prerender(canvas) {
    canvas.circle(0, 0, this.radius)
  },
})
