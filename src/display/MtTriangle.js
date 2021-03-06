import phina from 'phina.js'
import Matter from 'matter-js'

import MtShape from './MtShape'

export default phina.define('mc.display.MtTriangle', {
  superClass: MtShape,

  /** Matter側のオブジェクトと合わせるための角度オフセット値 */
  rotationOffset: 30,

  init(options) {
    options = {}.$safe(options, {
      backgroundColor: 'transparent',
      fill: 'green',
      stroke: false,
      radius: 87,
    })
    this.superInit(options)

    this.setBoundingType('circle')

    this.mtBody = Matter.Bodies.polygon(this.x, this.y, 3, this.radius, {
      restitution: 0.5,
    })
    this.mtSetAngle((this.rotation - this.rotationOffset) * Math.DEG_TO_RAD)
    this.mtSetLabel('triangle')

    // mtBodyから自分にアクセスできるようにする
    this.mtBody.plugin.mcObject = this

    if (!options.unsync) {
      // mtBodyと同期
      this.on('enterframe', (e) => {
        this.x = this.mtBody.position.x
        this.y = this.mtBody.position.y
        this.rotation = this.mtBody.angle * Math.RAD_TO_DEG + this.rotationOffset
      })
    }
  },

  /**
   * @see phina.display.TriangleShape
   */
  prerender(canvas) {
    canvas.polygon(0, 0, this.radius, 3)
  },
})
