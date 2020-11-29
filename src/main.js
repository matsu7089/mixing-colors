import phina from 'phina.js'
import { SCREEN } from './constants'

import { MainScene } from './scene/'

const scenes = [
  {
    className: MainScene.prototype.className,
    label: 'main',
  },
]

phina.main(() => {
  const runner = (e) => {
    requestAnimationFrame(e)
  }

  const app = phina.game.GameApp({
    width: SCREEN.W,
    height: SCREEN.H,
    startLabel: 'main',
    runner,
    scenes,
  })
  app.run()
})
