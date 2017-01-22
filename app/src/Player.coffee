"use strict"

Clock = require 'src/Clock'
Wave  = require 'src/Wave'
Utils = require 'src/Utils'

module.exports = class Player
  MARGIN  = 60
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
      y: (window.innerHeight) / 2
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

    @immunityClock = new Clock()
    @isHit = false
    @dead = false
    @gui = document.querySelector ".hp.#{@getClass()}"

    @deadSpeed = 300

    @hp = 5

    @waves = []
    for i in [0..10]
      @waves.push new Wave(0, 0)

  getClass: () ->
    if @playerNumber == 1
      "playerOne"
    else
      "playerTwo"

  getSpeed: () ->
    speed = Math.abs(@velocity.y / 100)
    if @dead
      speed = @deadSpeed
      @deadSpeed = Math.max(@deadSpeed - 0.01, 0)
    speed

  getDamage: () ->
    return if @dead
    return if @isHit and @immunityClock.getElapsedTime() < 2
    @hp -= 1
    @dead = @hp <= 0
    console.log "Aww! Only #{@hp} HP left"
    @immunityClock.deltaTime()
    @isHit = true
    letters = @gui.querySelectorAll 'span:not(.out)'
    if letters[letters.length - 1]
      letters[letters.length - 1].classList.add 'out'

  moveUp: () ->
    @velocity.y -= 50
    @velocity.y = -400 if @velocity.y < -400

  moveDown: () ->
    @velocity.y += 50
    @velocity.y = 400 if @velocity.y > 400

  wave: () ->
    return if @cooldown.getElapsedTime() < 1.5
    @cooldown.deltaTime()
    for wave in @waves
      unless wave.alive
        wave.originateFrom(@).shootTo(@playerNumber)
        break

  update: () ->
    return if @dead
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
      radius:40
    }

  draw: (ctx) ->
    timeSinceLastFrame = @drawClock.deltaTime()
    shouldDraw = true

    @angle += (Math.PI / 5) * timeSinceLastFrame
    @angle = @angle % (2 * Math.PI)

    @update()

    @pos.y += @velocity.y * timeSinceLastFrame
    @clampYPos()
    unless @hasKeyPressed()
      @velocity.y *= @friction * timeSinceLastFrame

    if @isHit and @immunityClock.getElapsedTime() < 3
      shouldDraw = (
        (@immunityClock.getElapsedTime() * 1000) % 300
      ) < 150
    else
      @isHit = false

    if shouldDraw and not @dead
      ctx.save()
      ctx.globalAlpha = 1
      ctx.lineWidth = 2.5
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
