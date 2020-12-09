import phina from 'phina.js'
import Matter from 'matter-js'
import { SCREEN, COLOR, FONT, BASE_COLOR, MIXED_COLORS } from '../constants'

import { MatterLayer } from '../matter/'
import { CircleShape, RectangleShape, TriangleShape } from '../display/'
import { Wave } from '../effect/'

import { cmyExact, cmyToRgb } from '../utils'

export default phina.define('mc.scene.MainScene', {
  superClass: phina.display.DisplayScene,

  /** MatterLayer */
  mtLayer: null,

  /** cmy colors */
  baseColors: null,
  mixedColors: null,

  level: null,
  stage: null,
  time: null,
  isClear: null,

  answers: null,

  init(options) {
    this.superInit(options)

    this.baseColors = Object.values(BASE_COLOR)
    this.mixedColors = MIXED_COLORS

    this.backgroundColor = COLOR.BASE

    this.mtLayer = MatterLayer({
      width: SCREEN.W,
      height: SCREEN.H,
    }).addChildTo(this)

    this.mtLayer.mtWorld.gravity.y = 0

    this._createWall()

    this.topBar = phina.display
      .RectangleShape({
        fill: '#fff',
        stroke: 'transparent',
        width: SCREEN.W,
        height: SCREEN.H / 8,
        x: SCREEN.W / 2,
        y: SCREEN.H / 16,
      })
      .addChildTo(this)

    const labelOptions = {
      fill: '#888',
      fontSize: 28,
      fontFamily: FONT.DEFAULT,
      fontWeight: '300',
      align: 'left',
      x: 10,
    }

    this.stageLabel = phina.display
      .Label({
        ...labelOptions,
        text: `stage: 1`,
        y: 30,
      })
      .addChildTo(this)

    this.timeLabel = phina.display
      .Label({
        ...labelOptions,
        text: `time:\n  00:01`,
        y: 80,
      })
      .addChildTo(this)

    this.mtLayer.on('collisionStart', (e) => {
      this._onCollision(e)
    })

    this.mtLayer.on('startdrag', (e) => {
      e.body.plugin.isDrag = true
    })
    this.mtLayer.on('enddrag', (e) => {
      e.body.plugin.isDrag = false
    })

    this.time = 0
    this.level = 1
    this.stage = 1
    this.isClear = false

    this._createStage()
  },

  update(app) {
    this.time += app.ticker.deltaTime

    const sec = Math.floor(this.time / 1000)
    const min = Math.floor(sec / 60)

    const strSec = (sec % 60).padding(2, '0')
    const strMin = min.padding(2, '0')

    this.timeLabel.text = `time:\n  ${strMin}:${strSec}`
  },

  _spawn(type, cmy, position) {
    const options = {
      cmyList: [cmy],
    }

    let shape
    switch (type) {
      case 'rectangle':
        shape = RectangleShape(options)
        break
      case 'circle':
        shape = CircleShape(options)
        break
      case 'triangle':
        shape = TriangleShape(options)
        break
    }

    position = position || { x: SCREEN.W / 2, y: SCREEN.H / 2 }

    shape.addChildTo(this.mtLayer).mtSetPosition(position)
    shape.mtSetAngularVelocity(Math.randfloat(-0.5, 0.5))
  },

  _onCollision(e) {
    if (this.isClear) return

    const { bodyA, bodyB } = e.pairs[0]
    const mcObjA = bodyA.plugin.mcObject
    const mcObjB = bodyB.plugin.mcObject

    // 壁と衝突したとき
    if (bodyA.plugin.mcLabel === 'wall') {
      if (bodyB.plugin.isDrag || mcObjB.cmyList.length === 1 || bodyB.speed < 30) return

      mcObjB.cmyList.forEach((cmy) => {
        this._spawn(bodyB.plugin.mcLabel, cmy, bodyB.position)
      })

      Wave(mcObjB.fill, mcObjB.position).addChildTo(this)
      mcObjB.remove()

      this._checkClear()
    }
    // 同じ種類のオブジェクト同士
    else if (bodyA.plugin.mcLabel === bodyB.plugin.mcLabel) {
      // どちらもドラッグ中でなければreturn
      if (!bodyA.plugin.isDrag && !bodyB.plugin.isDrag) return
      if (mcObjA.cmyList.length + mcObjB.cmyList.length > 6) return

      if (bodyB.plugin.isDrag) {
        mcObjB.cmyList.push(...mcObjA.cmyList)
        mcObjB.applyCmyList()
        mcObjA.remove()

        Wave(mcObjB.fill, mcObjB.position).addChildTo(this)
      } else {
        mcObjA.cmyList.push(...mcObjB.cmyList)
        mcObjA.applyCmyList()
        mcObjB.remove()

        Wave(mcObjA.fill, mcObjA.position).addChildTo(this)
      }

      this._checkClear()
    }
  },

  _checkClear() {
    this.answers.forEach((ans) => {
      ans.isCorrect = false
      ans.starShape.fill = '#fff'
    })

    objLoop: for (const obj of this.mtLayer.children) {
      for (const ans of this.answers) {
        if (!ans.isCorrect && cmyExact(obj.cmyList, ans.cmyList)) {
          ans.isCorrect = true
          ans.starShape.fill = ans.starShape.stroke
          continue objLoop
        }
      }
    }

    if (this.answers.every((v) => v.isCorrect)) {
      this.isClear = true
      this._transionNextStage()
    }
  },

  _createStage() {
    const answers = []

    const shapeTypeList = ['rectangle', 'circle', 'triangle']

    const numOfQue = this.level + 1
    let prevShapeIndex = Math.randint(0, 2)

    for (let i = 0; i < numOfQue; i++) {
      const cmyList = this.mixedColors.pickup()

      const shapeIndex = (Math.randint(1, 2) + prevShapeIndex) % 3
      const type = shapeTypeList[shapeIndex]

      cmyList.forEach((cmy) => {
        this._spawn(type, cmy)
      })

      // ダミーを生成
      this._spawn(type, this.baseColors.pickup())
      this._spawn(type, this.baseColors.pickup())

      prevShapeIndex = shapeIndex

      const offsetX = (numOfQue - 1) * 50
      const starShape = phina.display
        .StarShape({
          padding: 20,
          radius: 38,
          x: i * 100 - offsetX,
          fill: '#fff',
          stroke: cmyToRgb(cmyList),
          strokeWidth: 20,
          sideIndent: 0.5,
          rotation: -180,
        })
        .setScale(0)
        .addChildTo(this.topBar)

      starShape.tweener.wait(i * 200).to(
        {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
        },
        500,
        'swing'
      )

      answers.push({
        starShape,
        cmyList,
        isCorrect: false,
      })
    }

    this.answers = answers
    this.stageLabel.text = `stage: ${this.stage}`

    this.isClear = false
  },

  _transionNextStage() {
    this.topBar.children.forEach((star, i) => {
      star.tweener
        .clear()
        .wait(i * 100)
        .to(
          {
            scaleX: 0,
            scaleY: 0,
            rotation: 180,
          },
          500,
          'swing'
        )
        .call(() => {
          const pos = star.position.clone().add(this.topBar.position)
          Wave(star.fill, pos).addChildTo(this)
          star.remove()
        })
    })

    this.mtLayer.children.forEach((shape, i) => {
      shape.tweener
        .wait(i * 100)
        .to(
          {
            scaleX: 0,
            scaleY: 0,
          },
          500,
          'easeInSine'
        )
        .call(() => {
          Wave(shape.fill, shape.position).addChildTo(this)
          shape.remove()
        })
    })

    this.tweener
      .clear()
      .wait(this.mtLayer.children.length * 100 + 600)
      .call(() => {
        this.stage++
        this._createStage()
      })
  },

  _createWall() {
    const size = 1000

    const options = {
      isStatic: true,
    }

    const walls = [
      // top
      Matter.Bodies.rectangle(SCREEN.W / 2, -size / 2 + SCREEN.H / 8, SCREEN.W + size * 2, size, options),
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
