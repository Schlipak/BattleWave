"use strict"

WarpGrid = require 'src/WarpGrid'

module.exports = class Surface
  constructor: (target) ->
    @canvas = document.createElement 'CANVAS'
    target.appendChild @canvas
    @context = @canvas.getContext '2d'

    @objects = []
    @setupComposer()
    (registerResize.bind(@))()
    (resizeScene.bind(@))(window)

    @grid = new WarpGrid(@width(), @height())
    @add(@grid)

    _this = @
    @canvas.onmousemove = (e) ->
      posx = e.clientX
      posy = e.clientY
      _this.grid.setWavePoint({
        originX: posx,
        originY: posy
      })

  setupComposer: () ->
    console.log '[Surface] Setting up composer'

  width: () ->
    @canvas.width

  height: () ->
    @canvas.height

  clear: () ->
    @context.clearRect(0, 0, @width(), @height())

  add: (obj) -> @objects.push obj

  render: () ->
    @context.fillStyle = '#212121'
    @context.fillRect(0, 0, @width(), @height())
    for obj in @objects
      obj.draw @context

  resizeScene = (win) ->
    console.log '[Surface] Resizing'
    height  = win.innerHeight
    width   = win.innerWidth

    @canvas.width = width
    @canvas.height = height

  registerResize = () ->
    _this = @
    window.addEventListener('resize', (e) ->
      (resizeScene.bind(_this))(e.target)
    )
