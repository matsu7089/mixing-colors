import phina from 'phina.js'
import { SCREEN } from './constants'

import './scene/'

const scenes = [
  {
    className: 'mc.scene.TitleScene',
    label: 'title',
  },
  {
    className: 'mc.scene.MainScene',
    label: 'main',
  },
  {
    className: 'mc.scene.ResultScene',
    label: 'result',
  },
]

phina.main(() => {
  const runner = (e) => {
    requestAnimationFrame(e)
  }

  const app = phina.game.GameApp({
    width: SCREEN.W,
    height: SCREEN.H,
    startLabel: 'title',
    runner,
    scenes,
  })
  app.run()
})
