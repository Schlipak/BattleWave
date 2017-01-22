"use strict"

WarpGrid  = require 'src/WarpGrid'
Clock     = require 'src/Clock'

module.exports = class Surface
  constructor: (@target, @gameInstance) ->
    @canvas = document.createElement 'CANVAS'
    @target.appendChild @canvas
    @message = document.getElementById 'message'
    @context = @canvas.getContext '2d'

    @objects = []
    @playerOne = null
    @playerTwo = null

    @hasDeath = false
    @deathTimeout = new Clock()

    (registerResize.bind(@))()
    (resizeScene.bind(@))(window)

    @grid = new WarpGrid(@width(), @height())

    @background = @context.createLinearGradient(
      0, @height() / 2,
      @width(), @height() / 2
    )
    @background.addColorStop(0, "#07274f")
    @background.addColorStop(1, "#501644")

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

  checkForDeath: () ->
    return if @hasDeath
    if @playerOne.dead or @playerTwo.dead
      @hasDeath = true
      @deathTimeout.deltaTime()

  displayWinMessage: () ->
    return if @message.classList.contains 'visible'

    lineOne = @message.getElementsByClassName('one')[0]
    lineTwo = @message.getElementsByClassName('two')[0]
    lineThree = @message.getElementsByClassName('three')[0]
    if @playerOne.dead and @playerTwo.dead
      lineOne.innerHTML = "IT'S"
      lineTwo.innerHTML = "A"
      lineThree.innerHTML = "TIE"
    else if @playerOne.dead
      lineOne.innerHTML = "PLAYER"
      lineTwo.innerHTML = "TWO"
      lineThree.innerHTML = "WINS"
    else
      lineOne.innerHTML = "PLAYER"
      lineTwo.innerHTML = "ONE"
      lineThree.innerHTML = "WINS"
    @message.classList.add 'visible'
    _this = @
    window.addEventListener 'keydown', (e) ->
      key = e.keyCode or e.which
      return if _this.target.classList.contains 'off'
      if key == 32 or key == 13
        _this.target.classList.add 'off'
        _this.gameInstance.audio.pause() if _this.gameInstance.audio
        _this.gameInstance.crtOff.play() if _this.gameInstance.crtOff
        setTimeout((() ->
          window.location.reload(false)
        ), 3000)

  render: () ->
    @context.save()
    @context.fillStyle = @background
    @context.fillRect(0, 0, @width(), @height())
    @grid.draw @context, @playerOne, @playerTwo
    for obj in @objects
      obj.draw @context
    @context.restore()

    @context.fillStyle = @vignette
    @context.fillRect 0, 0, @width(), @height()

    @checkForDeath() if @playerOne? and @playerTwo?

    if @hasDeath and @deathTimeout.getElapsedTime() > 3
      @displayWinMessage()

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
