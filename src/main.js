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
  const app = phina.game.GameApp({
    width: SCREEN.W,
    height: SCREEN.H,
    startLabel: 'main',
    scenes,
  })
  app.run()
})
