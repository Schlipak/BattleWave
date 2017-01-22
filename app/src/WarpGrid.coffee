"use strict"

Particle  = require 'src/Particle'
Utils     = require 'src/Utils'

module.exports = class WarpGrid
  @GRID_COUNT = 50

  type: "WarpGrid"

  constructor: (size) ->
    @particles = []
    for y in [0..WarpGrid.GRID_COUNT]
      row = []
      for x in [0..WarpGrid.GRID_COUNT]
        particle = new Particle(
          x * (size / WarpGrid.GRID_COUNT),
          y * (size / WarpGrid.GRID_COUNT),
          1, 0
        )
        particle.target = {
          pos: {
            x: x * (size / WarpGrid.GRID_COUNT),
            y: y * (size / WarpGrid.GRID_COUNT)
          }
        }
        particle.setSpring(particle.target)
        particle.k = 0.01
        particle.springLength = 0.1
        particle.friction = 0.7
        particle.radius = .5
        particle.color = '#a5d4de'
        row.push particle
      @particles.push row

  collide: (playerOne, playerTwo) ->
    p1Collider = playerOne.getHitbox()
    p2Collider = playerTwo.getHitbox()
    for wave in playerTwo.waves
      continue unless wave.alive
      wcollider = wave.getHitbox()
      if Utils.intersects(p1Collider, wcollider)
        playerOne.getDamage()
        break
    for wave in playerOne.waves
      continue unless wave.alive
      wcollider = wave.getHitbox()
      if Utils.intersects(p2Collider, wcollider)
        playerTwo.getDamage()
        break

  draw: (ctx, playerOne, playerTwo) ->
    for y in [0..WarpGrid.GRID_COUNT]
      for x in [0..WarpGrid.GRID_COUNT]
        particle = @particles[y][x]

        right = null
        if x + 1 <= WarpGrid.GRID_COUNT
          right = @particles[y][x + 1]

        bottom = null
        if y + 1 <= WarpGrid.GRID_COUNT
          bottom = @particles[y + 1][x]

        ctx.lineWidth = 1
        ctx.globalAlpha = 0.1 + particle.getSpeed()

        hue = (220 + particle.getSpeed() * 20) % 360
        ctx.strokeStyle = "hsl(#{hue}, 50%, 50%)"

        if right?
          ctx.beginPath()
          ctx.moveTo particle.pos.x, particle.pos.y
          ctx.lineTo right.pos.x, right.pos.y
          ctx.closePath()
          ctx.stroke()

        if bottom?
          ctx.beginPath()
          ctx.moveTo particle.pos.x, particle.pos.y
          ctx.lineTo bottom.pos.x, bottom.pos.y
          ctx.closePath()
          ctx.stroke()

        ctx.globalAlpha = 1
        ctx.fillStyle = 'white'

        particle.draw ctx
        particle.render()

        particle.warp playerOne
        particle.warp playerTwo
        for wave in playerOne.waves
          particle.warp wave
        for wave in playerTwo.waves
          particle.warp wave

        @collide(playerOne, playerTwo)
