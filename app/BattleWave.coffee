"use strict"

Clock       = require 'src/Clock'
Surface     = require 'src/Surface'
ScreenSpace = require 'src/ScreenSpace'
WarpGrid    = require 'src/WarpGrid'

module.exports = class BattleWave
  constructor: (@target) ->
    @clock    = new Clock()
    @surface  = new Surface(@target)
    @screen   = new ScreenSpace(@surface)
    @grid     = new WarpGrid(
      @surface.width(), @surface.height()
    )
    @surface.add @grid
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
