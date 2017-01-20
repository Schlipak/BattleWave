'use strict'

Clock = require 'src/Clock'

module.exports = class BattleWave
  constructor: () ->
    @clock = new Clock()

  deltaTime: () -> @clock.deltaTime()

  start: () ->
    requestAnimationFrame(@gameLoop.bind(@))

  gameLoop: () ->
    console.log "TimeSinceLastFrame: #{@deltaTime()}"
    requestAnimationFrame(@gameLoop.bind(@))

document.addEventListener 'DOMContentLoaded', () ->
  bw = new BattleWave()
  # bw.start()
