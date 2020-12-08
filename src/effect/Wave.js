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
  },
})
