import phina from 'phina.js'
import { SCREEN } from './constants'

import './scene/'

const scenes = [
  {
    className: 'mc.scene.MainScene',
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
