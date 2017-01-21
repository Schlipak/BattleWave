"use strict"

Clock       = require 'src/Clock'
Surface     = require 'src/Surface'
WarpGrid    = require 'src/WarpGrid'

window.CanvasRenderingContext2D.prototype.polygon = (x, y, radius, sides) ->
  if sides > 2
    for i in [0...sides]
      angle = (Math.PI * 2 / sides * i) - Math.PI / 2
      @lineTo(
        Math.cos(angle) * radius + x,
        Math.sin(angle) * radius + y
      )
    angle = (Math.PI * 2 / sides * sides) - Math.PI / 2
    @lineTo(
      Math.cos(angle) * radius + x,
      Math.sin(angle) * radius + y
    )
  else
    @arc(x, y, radius, 0, 2 * Math.PI)

module.exports = class BattleWave
  constructor: (@target) ->
    @clock    = new Clock()
    @surface  = new Surface(@target)
    @loopId   = null

  deltaTime: () -> @clock.deltaTime()

  start: () ->
    console.log '[BattleWave] Starting'
    @loopId = requestAnimationFrame(@gameLoop.bind(@))

  stop: () ->
    console.log '[BattleWave] Stopping'
    cancelAnimationFrame(@loopId)

  gameLoop: () ->
    @surface.clear()
    @surface.render()
    @loopId = requestAnimationFrame(@gameLoop.bind(@))

document.addEventListener 'DOMContentLoaded', () ->
  console.log '[BattleWave] Initializing'
  target = document.getElementById 'target'
  bw = new BattleWave(target)
  bw.start()
