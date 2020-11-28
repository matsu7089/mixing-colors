import phina from 'phina.js'
import Matter from 'matter-js'

export default phina.define('mc.matter.MatterLayer', {
  superClass: phina.display.DisplayElement,

  /** Matter.Engine */
  mtEngine: null,
  /** Matter.World */
  mtWorld: null,

  init(options) {
    this.superInit(options)

    this.mtEngine = Matter.Engine.create()
    this.mtWorld = this.mtEngine.world

    // Matterのイベントをflareで通知
    const mtEventCallback = (e) => {
      this.has(e.name) && this.flare(e.name, e)
    }
    ;['collisionStart', 'collisionActive', 'collisionEnd'].forEach((name) => {
      Matter.Events.on(this.mtEngine, name, mtEventCallback)
    })

    // マウス操作可能にするために1度だけ実行
    this.one('enterframe', (e) => {
      const mouse = Matter.MouseConstraint.create(this.mtEngine, {
        mouse: Matter.Mouse.create(e.app.canvas.domElement),
      })
      Matter.World.add(this.mtWorld, mouse)
    })

    // 毎フレームmtEngineを更新
    this.on('enterframe', (e) => {
      const delta = e.app.ticker.deltaTime
      Matter.Engine.update(this.mtEngine, delta)
    })
  },

  /**
   * addChildされた時にmtBodyをmtWorldに追加します
   * @override
   */
  addChild(child) {
    this.superMethod('addChild', child)

    if (child.mtBody) {
      Matter.World.add(this.mtWorld, child.mtBody)
    }

    return child
  },

  /**
   * removeChildされた時にmtBodyをmtWorldから削除します
   * @override
   */
  removeChild(child) {
    this.superMethod('removeChild', child)

    if (child.mtBody) {
      Matter.World.remove(this.mtWorld, child.mtBody)
    }

    return this
  },
})
