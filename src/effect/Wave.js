import phina from 'phina.js'

export default phina.define('mc.effect.Wave', {
  superClass: phina.display.CircleShape,

  init(color, position) {
    this.superInit({
      padding: 50,
      radius: 50,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 50,
      x: position.x,
      y: position.y,
    })

    this.tweener
      .clear()
      .to(
        {
          radius: 200,
          strokeWidth: 0,
        },
        200,
        'easeOutSine'
      )
      .call(() => {
        this.remove()
      })

    const rad = 120 * Math.DEG_TO_RAD
    const offset = Math.random() * rad

    for (let i = 1; i <= 3; i++) {
      const shape = phina.display
        .CircleShape({
          radius: 50,
          stroke: 'transparent',
          fill: color,
        })
        .addChildTo(this)

      shape.tweener
        .clear()
        .to(
          {
            radius: 0,
            x: Math.cos(rad * i + offset) * 300,
            y: Math.sin(rad * i + offset) * 300,
          },
          200,
          'easeOutSine'
        )
        .call(() => {
          shape.remove()
        })
    }
  },
})
