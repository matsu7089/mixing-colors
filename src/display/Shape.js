import phina from 'phina.js'
import Matter from 'matter-js'

import { COLOR, FONT } from '../constants'

export default phina.define('mc.display.Shape', {
  superClass: phina.display.Shape,

  /** Matter.Body */
  mtBody: null,

  /** 数を表示するラベル */
  label: null,

  /** cmyのリスト */
  cmyList: null,

  init(options) {
    this.superInit(options)

    this.label = phina.display
      .Label({
        fontSize: 50,
        text: '1',
        fill: '#888',
        fontFamily: FONT.DEFAULT,
        fontWeight: '700',
        stroke: '#fff',
        strokeWidth: 12,
      })
      .addChildTo(this)

    this.cmyList = options.cmyList || [{ c: 1, m: 0, y: 0 }]
    this.applyCmyList()
  },

  /**
   * cmyListを反映させます
   */
  applyCmyList() {
    const len = this.cmyList.length
    const cmy = { c: 0, m: 0, y: 0 }

    this.cmyList.forEach((v) => {
      cmy.c += v.c / len
      cmy.m += v.m / len
      cmy.y += v.y / len
    })

    cmy.c = Math.min(cmy.c, 1) * 0.7
    cmy.m = Math.min(cmy.m, 1) * 0.7
    cmy.y = Math.min(cmy.y, 1) * 0.7

    const r = Math.floor((1 - cmy.c) * 255)
    const g = Math.floor((1 - cmy.m) * 255)
    const b = Math.floor((1 - cmy.y) * 255)

    this.fill = `rgb(${r}, ${g}, ${b})`
    this.label.text = len.toString()

    return this
  },

  /**
   * mtBodyにラベルを設定します
   * @param {String} label 設定するラベル
   */
  mtSetLabel(label) {
    this.mtBody.plugin.mcLabel = label
    return this
  },

  // Matter.Body.xxxを直接呼べるようにする
  mtSet(settings, value) {
    Matter.Body.set(this.mtBody, settings, value)
    return this
  },

  mtSetStatic(isStatic) {
    Matter.Body.setStatic(this.mtBody, isStatic)
    return this
  },

  mtSetDensity(density) {
    Matter.Body.setDensity(this.mtBody, density)
    return this
  },

  mtSetInertia(inertia) {
    Matter.Body.setInertia(this.mtBody, inertia)
    return this
  },

  mtSetVertices(vertices) {
    Matter.Body.setVertices(this.mtBody, vertices)
    return this
  },

  mtSetParts(parts, autoHull) {
    Matter.Body.setParts(this.mtBody, parts, autoHull)
    return this
  },

  mtSetPosition(position) {
    Matter.Body.setPosition(this.mtBody, position)
    return this
  },

  mtSetAngle(angle) {
    Matter.Body.setAngle(this.mtBody, angle)
    return this
  },

  mtSetVelocity(velocity) {
    Matter.Body.setVelocity(this.mtBody, velocity)
    return this
  },

  mtSetAngularVelocity(velocity) {
    Matter.Body.setAngularVelocity(this.mtBody, velocity)
    return this
  },

  mtTranslate(translation) {
    Matter.Body.translate(this.mtBody, translation)
    return this
  },

  mtRotate(rotation, point) {
    Matter.Body.rotate(this.mtBody, rotation, point)
    return this
  },

  mtScale(scaleX, scaleY, point) {
    Matter.Body.scale(this.mtBody, scaleX, scaleY, point)
    this.setScale(this.scale.x * scaleX, this.scale.y * scaleY)
    return this
  },

  mtApplyForce(position, force) {
    Matter.Body.applyForce(this.mtBody, position, force)
    return this
  },
})
