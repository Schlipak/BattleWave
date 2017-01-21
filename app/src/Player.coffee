"use strict"

Clock = require 'src/Clock'
Wave  = require 'src/Wave'

module.exports = class Player
  MARGIN  = 80
  SIZE    = 50
  COLORS = [
    "#8e44ad",
    "#7755b8",
    "#6166c4",
    "#4a77cf",
    "#3489db"
  ]

  KEYBOARD = [
    {
      moveUp: [90, 87],
      moveDown: [83],
      wave: [68]
    },
    {
      moveUp: [38],
      moveDown: [40],
      wave: [37]
    }
  ]

  constructor: (@playerNumber) ->
    @pos = {
      x: 0,
      y: MARGIN
    }
    if @playerNumber == 1
      @pos.x = MARGIN
    else
      @pos.x = window.innerWidth - MARGIN
    @velocity = {x: 0, y: 0}
    @friction = 0.1
    @angle = 0
    @colors = COLORS
    if @playerNumber == 2
      @colors = Object.create(COLORS).reverse()
    @drawClock = new Clock()
    @cooldown = new Clock()

    @waves = []
    for i in [0..10]
      @waves.push new Wave(0, 0)

  getSpeed: () ->
    Math.abs(@velocity.y / 100)

  moveUp: () ->
    @velocity.y -= 50
    @velocity.y = -400 if @velocity.y < -400

  moveDown: () ->
    @velocity.y += 50
    @velocity.y = 400 if @velocity.y > 400

  wave: () ->
    return if @cooldown.getElapsedTime() < 2
    @cooldown.deltaTime()
    for wave in @waves
      unless wave.alive
        wave.originateFrom(@).shootTo(@playerNumber)
        break

  update: () ->
    kb = window.$keyboard
    for dir of KEYBOARD[@playerNumber - 1]
      for key in KEYBOARD[@playerNumber - 1][dir]
        if kb[key]
          @[dir]()
          break

  hasKeyPressed: () ->
    for dir of KEYBOARD[@playerNumber - 1]
      for key in KEYBOARD[@playerNumber - 1][dir]
        continue if dir == 'wave'
        return true if window.$keyboard[key]
    false

  clampYPos: () ->
    @pos.y = MARGIN if @pos.y < MARGIN
    @pos.y = window.innerHeight - MARGIN if @pos.y > window.innerHeight - MARGIN

  getHitbox: () ->
    {
      pos: @pos,
      radius: 50
    }

  draw: (ctx) ->
    timeSinceLastFrame = @drawClock.deltaTime()

    @angle += (Math.PI / 5) * timeSinceLastFrame
    @angle = @angle % (2 * Math.PI)

    @update()

    @pos.y += @velocity.y * timeSinceLastFrame
    @clampYPos()
    unless @hasKeyPressed()
      @velocity.y *= @friction * timeSinceLastFrame

    ctx.save()
    ctx.globalAlpha = 1
    ctx.lineWidth = 2
    ctx.translate @pos.x, @pos.y
    for i in [0...(SIZE / 10)]
      ctx.save()
      if i % 2 == 0
        ctx.rotate @angle
      else
        ctx.rotate -@angle
      ctx.beginPath()
      ctx.strokeStyle = @colors[i]
      ctx.polygon(0, 0, SIZE - (i * 10), 6 - i)
      ctx.stroke()
      ctx.restore()
    ctx.restore()

    for wave in @waves
      wave.draw()
