import phina from 'phina.js'
import { FONT, BASE_COLOR, MIXED_COLORS } from '../constants'

import { MtCircle, MtRectangle, MtTriangle, AnsStar } from '../display/'
import { Wave } from '../effect/'

import { cmyToRgb } from '../utils'

export default phina.define('mc.scene.HowToScene', {
  superClass: phina.display.DisplayScene,

  init(options) {
    this.superInit(options)

    this.backgroundColor = '#777'

    const gx = this.gridX
    const gy = this.gridY

    const buttonOptions = {
      width: 80,
      height: 80,
      fill: false,
      stroke: '#fff',
      strokeWidth: 4,
      fontColor: '#fff',
      fontFamily: FONT,
      fontWeight: '700',
    }

    const labelOptions = {
      fill: '#fff',
      fontSize: 30,
      fontFamily: FONT,
      fontWeight: '700',
    }

    const exitButton = phina.ui
      .Button({
        ...buttonOptions,
        text: '×',
        x: gx.span(14),
        y: gy.span(2),
      })
      .addChildTo(this)

    exitButton.on('click', () => {
      this.exit()
    })

    this.rect = phina.display
      .RectangleShape({
        fill: '#eee',
        stroke: false,
        cornerRadius: 10,
        width: gx.span(14),
        height: gy.span(6),
        x: gx.center(),
        y: gy.span(6),
      })
      .addChildTo(this)

    const leftButton = phina.ui
      .Button({
        ...buttonOptions,
        text: '◀',
        x: gx.span(2),
        y: gy.span(14),
      })
      .addChildTo(this)

    const rightButton = phina.ui
      .Button({
        ...buttonOptions,
        text: '▶',
        x: gx.span(14),
        y: gy.span(14),
      })
      .addChildTo(this)

    this.label = phina.display
      .Label({
        ...labelOptions,
        align: 'left',
        x: gx.span(1),
        y: gy.span(10),
      })
      .setOrigin(0.5, 0)
      .addChildTo(this)

    this.pageLabel = phina.display
      .Label({
        ...labelOptions,
        x: gx.center(),
        y: gy.span(14),
      })
      .addChildTo(this)

    rightButton.on('click', () => {
      this.page++
      if (this.page === 8) {
        this.page = 1
      }
      this._changePage()
    })

    leftButton.on('click', () => {
      this.page--
      if (this.page === 0) {
        this.page = 7
      }
      this._changePage()
    })

    this.page = 1
    this._changePage()
  },

  _changePage() {
    this.pageLabel.text = `${this.page} / 7`
    this.rect.children.clear()

    switch (this.page) {
      case 1:
        this._page1()
        break
      case 2:
        this._page2()
        break
      case 3:
        this._page3()
        break
      case 4:
        this._page4()
        break
      case 5:
        this._page5()
        break
      case 6:
        this._page6()
        break
      case 7:
        this._page7()
        break
    }
  },

  _page1() {
    this.label.text = '基本の色は６色＋白の７種類、\n図形は丸、三角、四角の３種類あります。'

    const rect = this.rect
    const baseColors = Object.values(BASE_COLOR)

    baseColors.forEach((cmy, i) => {
      phina.display
        .CircleShape({
          radius: 25,
          stroke: false,
          fill: cmyToRgb([cmy]),
          x: i * 60 - 180,
          y: -80,
        })
        .addChildTo(rect)
    })

    const circle = MtCircle({
      cmyList: [baseColors.pickup()],
      x: -150,
      y: 60,
      unsync: true,
    }).addChildTo(rect)

    const triangle = MtTriangle({
      cmyList: [baseColors.pickup()],
      x: 0,
      y: 75,
      unsync: true,
    }).addChildTo(rect)

    const rectangle = MtRectangle({
      cmyList: [baseColors.pickup()],
      x: 150,
      y: 60,
      unsync: true,
    }).addChildTo(rect)

    ;[circle, triangle, rectangle].forEach((shape, i) => {
      shape.tweener
        .wait(i * 1000 + 1000)
        .call(() => {
          shape.rotation = 0
          shape.cmyList = [baseColors.pickup()]
          shape.applyCmyList()

          Wave(shape.fill, shape.position).addChildTo(rect)
        })
        .to(
          {
            rotation: 360,
          },
          1000,
          'swing'
        )
        .wait(3000 - i * 1000)
        .setLoop(true)
    })
  },

  _page2() {
    this.label.text = '同じ図形を合わせると色が混ざり、\n数が足されます。\nこの数は６になるまで色が混ざります。'

    const rect = this.rect
    const colors = [BASE_COLOR.CYAN, BASE_COLOR.MAGENTA, BASE_COLOR.YELLOW]

    const color1 = colors.pickup()
    const color2 = colors.pickup()

    const circle1 = MtCircle({
      cmyList: [color1],
      x: -150,
      y: 0,
      unsync: true,
    }).addChildTo(rect)

    const circle2 = MtCircle({
      cmyList: [color2],
      x: 150,
      y: 0,
      unsync: true,
    }).addChildTo(rect)

    circle1.tweener
      .to(
        {
          x: 0,
        },
        500,
        'easeInCubic'
      )
      .wait(1000)
      .call(() => {
        circle1.cmyList = [colors.pickup()]
        circle1.applyCmyList()
        circle1.x = -150
      })
      .setLoop(true)

    circle2.tweener
      .to(
        {
          x: 0,
        },
        500,
        'easeInCubic'
      )
      .call(() => {
        circle2.cmyList = [].concat(...circle1.cmyList, ...circle2.cmyList)
        circle2.applyCmyList()

        Wave(circle2.fill, { x: 0, y: 0 }).addChildTo(rect)
      })
      .wait(1000)
      .call(() => {
        circle2.cmyList = [colors.pickup()]
        circle2.applyCmyList()
        circle2.x = 150
      })
      .setLoop(true)
  },

  _page3() {
    this.label.text = '色の混ぜた図形を壁に勢いよく当てると、\n基本の色に分解されます。'

    const rect = this.rect

    const group = phina.display.DisplayElement().addChildTo(rect)

    const circle = MtCircle({
      cmyList: MIXED_COLORS.pickup(),
      x: 0,
      y: 120,
      unsync: true,
    }).addChildTo(rect)

    circle.tweener
      .to(
        {
          y: -120,
        },
        500,
        'easeInCubic'
      )
      .call(() => {
        circle.visible = false
        Wave(circle.fill, circle.position).addChildTo(rect)

        circle.cmyList.forEach((cmy, i, arr) => {
          const shape = MtCircle({
            cmyList: [cmy],
            x: 0,
            y: -120,
            unsync: true,
          }).addChildTo(group)

          shape.tweener.to(
            {
              y: 80,
              x: 180 * i - (arr.length - 1) * 90,
            },
            500,
            'easeOutCubic'
          )
        })
      })
      .wait(1500)
      .call(() => {
        group.children.clear()

        circle.cmyList = MIXED_COLORS.pickup()
        circle.applyCmyList()

        circle.y = 120
        circle.visible = true
      })
      .setLoop(true)
  },

  _page4() {
    this.label.text = '上に表示される星と同じ色を全て作ると\nステージクリアです！\n３回クリアでゲーム終了になります。'

    const rect = this.rect
    const color = MIXED_COLORS.pickup().slice()

    const star = phina.display
      .StarShape({
        padding: 20,
        radius: 38,
        sideIndent: 0.5,
        fill: '#fff',
        strokeWidth: 20,
        stroke: cmyToRgb(color),
        y: -80,
      })
      .addChildTo(rect)

    const color1 = [color.shift()]
    const color2 = color

    const circle1 = MtCircle({
      cmyList: color1,
      x: -150,
      y: 80,
      unsync: true,
    }).addChildTo(rect)

    const circle2 = MtCircle({
      cmyList: color2,
      x: 150,
      y: 80,
      unsync: true,
    }).addChildTo(rect)

    circle1.tweener
      .to(
        {
          x: 0,
        },
        500,
        'easeInCubic'
      )
      .wait(1000)
      .call(() => {
        circle1.cmyList = color1
        circle1.applyCmyList()
        circle1.x = -150
      })
      .setLoop(true)

    circle2.tweener
      .to(
        {
          x: 0,
        },
        500,
        'easeInCubic'
      )
      .call(() => {
        circle2.cmyList = [].concat(...circle1.cmyList, ...circle2.cmyList)
        circle2.applyCmyList()

        Wave(circle2.fill, { x: 0, y: 80 }).addChildTo(rect)

        star.fill = star.stroke
      })
      .wait(1000)
      .call(() => {
        circle2.cmyList = color2
        circle2.applyCmyList()
        circle2.x = 150

        star.fill = '#fff'
      })
      .setLoop(true)
  },

  _page5() {
    this.label.text = '星をタップするとヒントが表示されます。\nスコアが下がるので使いすぎには注意！'

    const rect = this.rect

    for (let i = 0; i < 3; i++) {
      AnsStar({
        cmyList: MIXED_COLORS.pickup(),
        x: i * 120 - 120,
      }).addChildTo(rect)
    }

    phina.display
      .Label({
        fill: '#777',
        fontSize: 30,
        fontFamily: FONT,
        fontWeight: '700',
        text: '↑タップしてみよう↑',
        y: 120,
      })
      .addChildTo(rect)
  },

  _page6() {
    this.label.text = '混色表 １\n星の色はこの中から選ばれます。\n組み合わせが２通りある色もあります。'

    const rect = this.rect

    for (let i = 0; i < 12; i++) {
      const cmyList = MIXED_COLORS[i]

      cmyList.forEach((cmy, j) => {
        phina.display
          .CircleShape({
            radius: 25,
            stroke: false,
            fill: cmyToRgb([cmy]),
            x: i < 6 ? j * 60 - 225 : j * 60 + 45,
            y: (i % 6) * 60 - 150,
          })
          .addChildTo(rect)
      })

      phina.display
        .Label({
          fill: '#777',
          fontSize: 30,
          fontFamily: FONT,
          fontWeight: '700',
          text: '→',
          x: i < 6 ? -105 : 165,
          y: (i % 6) * 60 - 150,
        })
        .addChildTo(rect)

      phina.display
        .CircleShape({
          radius: 25,
          stroke: false,
          fill: cmyToRgb(cmyList),
          x: i < 6 ? -45 : 225,
          y: (i % 6) * 60 - 150,
        })
        .addChildTo(rect)
    }
  },

  _page7() {
    this.label.text = '混色表 ２\n白を混ぜるときの組み合わせは、\n必ず赤青緑のいずれかを一緒に混ぜます。'

    const rect = this.rect

    for (let i = 0; i < 12; i++) {
      const cmyList = MIXED_COLORS[i + 12]

      cmyList.forEach((cmy, j) => {
        phina.display
          .CircleShape({
            radius: 25,
            stroke: '#eee',
            strokeWidth: 4,
            fill: cmyToRgb([cmy]),
            x: i < 6 ? j * 30 - 225 : j * 30 + 45,
            y: (i % 6) * 60 - 150,
          })
          .addChildTo(rect)
      })

      phina.display
        .Label({
          fill: '#777',
          fontSize: 30,
          fontFamily: FONT,
          fontWeight: '700',
          text: '→',
          x: i < 6 ? -105 : 165,
          y: (i % 6) * 60 - 150,
        })
        .addChildTo(rect)

      phina.display
        .CircleShape({
          radius: 25,
          stroke: false,
          fill: cmyToRgb(cmyList),
          x: i < 6 ? -45 : 225,
          y: (i % 6) * 60 - 150,
        })
        .addChildTo(rect)
    }
  },
})
