import phina from 'phina.js'
import Matter from 'matter-js'
import { SCREEN, COLOR } from '../constants'

import { MatterLayer } from '../matter/'
import { CircleShape, RectangleShape, TriangleShape } from '../display/'

export default phina.define('mc.scene.MainScene', {
  superClass: phina.display.DisplayScene,

  /** MatterLayer */
  mtLayer: null,

  init(options) {
    this.superInit(options)

    this.backgroundColor = COLOR.BASE

    this.mtLayer = MatterLayer({
      width: SCREEN.W,
      height: SCREEN.H,
    }).addChildTo(this)

    this.mtLayer.mtWorld.gravity.y = 0

    this._createWall()

    const cmyList = [
      { c: 1, m: 0, y: 0 },
      { c: 0, m: 1, y: 0 },
      { c: 0, m: 0, y: 0 },
      { c: 0, m: 0, y: 1 },
      { c: 1, m: 0, y: 0 },
    ]

    RectangleShape({
      width: 100,
      height: 100,
      x: 250,
      y: 250,
      cmyList,
    }).addChildTo(this.mtLayer)

    CircleShape({
      radius: 56,
      x: 500,
      y: 500,
      cmyList,
    }).addChildTo(this.mtLayer)

    TriangleShape({
      radius: 87,
      x: 250,
      y: 500,
      cmyList,
    }).addChildTo(this.mtLayer)

    this.mtLayer.on('collisionStart', (e) => {
      const { bodyA, bodyB } = e.pairs[0]
      const mcObjA = bodyA.plugin.mcObject
      const mcObjB = bodyB.plugin.mcObject

      // 壁と衝突したとき
      if (bodyA.plugin.mcLabel === 'wall') {
        if (bodyB.plugin.isDrag || mcObjB.cmyList.length === 1 || bodyB.speed < 100) return

        mcObjB.cmyList.forEach((cmy) => {
          this._spawn(bodyB.plugin.mcLabel, bodyB.position, [cmy])
        })

        mcObjB.remove()
      }
      // 同じ種類のオブジェクト同士
      else if (bodyA.plugin.mcLabel === bodyB.plugin.mcLabel) {
        // どちらもドラッグ中でなければreturn
        if (!bodyA.plugin.isDrag && !bodyB.plugin.isDrag) return
        if (mcObjA.cmyList.length + mcObjB.cmyList.length > 5) return

        if (bodyA.speed < bodyB.speed) {
          mcObjB.cmyList.push(...mcObjA.cmyList)
          mcObjB.applyCmyList()
          mcObjA.remove()
        } else {
          mcObjA.cmyList.push(...mcObjB.cmyList)
          mcObjA.applyCmyList()
          mcObjB.remove()
        }
      }
    })

    this.mtLayer.on('startdrag', (e) => {
      e.body.plugin.isDrag = true
    })
    this.mtLayer.on('enddrag', (e) => {
      e.body.plugin.isDrag = false
    })
  },

  _spawn(type, position, cmyList) {
    const area = 10000

    let shape
    switch (type) {
      case 'rectangle':
        shape = RectangleShape({
          width: Math.sqrt(area),
          height: Math.sqrt(area),
          isInvalid: true,
          cmyList,
        })
        break
      case 'circle':
        shape = CircleShape({
          radius: Math.floor(Math.sqrt(area / Math.PI)),
          isInvalid: true,
          cmyList,
        })
        break
      case 'triangle':
        shape = TriangleShape({
          radius: 87,
          isInvalid: true,
          cmyList,
        })
    }

    shape
      .addChildTo(this.mtLayer)
      .mtSetPosition(position)
      .mtSetAngularVelocity(Math.PI / 6)
  },

  _createWall() {
    const size = 1000

    const options = {
      isStatic: true,
    }

    const walls = [
      // top
      Matter.Bodies.rectangle(SCREEN.W / 2, -size / 2, SCREEN.W + size * 2, size, options),
      // bottom
      Matter.Bodies.rectangle(SCREEN.W / 2, SCREEN.H + size / 2, SCREEN.W + size * 2, size, options),
      // left
      Matter.Bodies.rectangle(-size / 2, SCREEN.H / 2, size, SCREEN.H + size * 2, options),
      // right
      Matter.Bodies.rectangle(SCREEN.W + size / 2, SCREEN.H / 2, size, SCREEN.H + size * 2, options),
    ]

    Matter.World.add(this.mtLayer.mtWorld, walls)

    walls.forEach((wall) => {
      wall.plugin.mcLabel = 'wall'
    })
  },
})
