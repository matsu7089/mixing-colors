import phina from 'phina.js'

export default phina.define('mc.display.PauseButton', {
  superClass: phina.display.RectangleShape,

  init(options) {
    options = {}.$safe(options, {
      width: 48,
      height: 48,
      fill: false,
      stroke: '#888',
      strokeWidth: 4,
      cornerRadius: 2,
    })
    this.superInit(options)

    const rectOptions = {
      width: 12,
      height: 24,
      fill: false,
      stroke: '#888',
      strokeWidth: 4,
      cornerRadius: 2,
    }

    phina.display.RectangleShape(rectOptions).setPosition(-10, 0).addChildTo(this)
    phina.display.RectangleShape(rectOptions).setPosition(10, 0).addChildTo(this)
  },
})
