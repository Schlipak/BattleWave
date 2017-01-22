"use strict"

Clock = require 'src/Clock'

module.exports = class Wave
  WAVE_SPEED = 1000

  constructor: (x, y) ->
    @pos = {x: x, y: y}
    @velocity = {x: 0, y: 0}
    @alive = false
    @clock = new Clock()

  originateFrom: (origin) ->
    @pos.x = origin.pos.x
    @pos.y = origin.pos.y
    @velocity.y = (origin.velocity.y / 5)
    @

  shootTo: (direction) ->
    @alive = true
    @velocity.x = WAVE_SPEED
    if direction == 2
      @velocity.x = -@velocity.x
    @

  getSpeed: () ->
    return 0 unless @alive
    10

  getHitbox: () ->
    {
      pos: @pos,
      radius: 40
    }

  draw: () ->
    timeSinceLastFrame = @clock.deltaTime()

    return unless @alive
    @pos.x += @velocity.x * timeSinceLastFrame
    @pos.y += @velocity.y * (timeSinceLastFrame * 10)

    if @pos.y <= 0 or @pos.y >= window.innerHeight
      @velocity.y = -@velocity.y
    if @pos.y <= 0
      @pos.y = 0
    if @pos.y >= window.innerHeight
      @pos.y = window.innerHeight

    if @pos.x < 0 or @pos.x > window.innerWidth
      @alive = false
      @velocity = {x: 0, y: 0}
