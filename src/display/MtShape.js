import phina from 'phina.js'
import Matter from 'matter-js'

import { COLOR, FONT } from '../constants'

import { cmyToRgb } from '../utils'

export default phina.define('mc.display.MtShape', {
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
        fontFamily: FONT,
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
    const { cmyList } = this

    this.fill = cmyToRgb(cmyList)
    this.label.text = cmyList.length

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
