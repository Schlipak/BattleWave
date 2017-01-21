"use strict"

WarpGrid = require 'src/WarpGrid'

module.exports = class Surface
  constructor: (target) ->
    @canvas = document.createElement 'CANVAS'
    target.appendChild @canvas
    @context = @canvas.getContext '2d'

    @objects = []
    (registerResize.bind(@))()
    (resizeScene.bind(@))(window)

    @grid = new WarpGrid(@width(), @height())
    @add(@grid)

    @vignette = @context.createRadialGradient(
      @width() / 2,
      @height() / 2,
      100,
      @width() / 2,
      @height() / 2,
      @width() / 2
    );
    @vignette.addColorStop(0, "transparent")
    @vignette.addColorStop(1, "rgba(0, 0, 0, .4)")

  width: () ->
    @canvas.width

  height: () ->
    @canvas.height

  clear: () ->
    @context.clearRect(0, 0, @width(), @height())

  add: (obj) ->
    @objects.push obj

  render: () ->
    @context.save()
    @context.fillStyle = "#20172a"
    @context.fillRect(0, 0, @width(), @height())
    for obj in @objects
      obj.draw @context
    @context.restore()

    @context.fillStyle = @vignette
    @context.fillRect 0, 0, @width(), @height()

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
