"use strict"

Particle = require 'src/Particle'

module.exports = class WarpGrid
  @GRID_COUNT = 50

  type: "WarpGrid"

  constructor: (size) ->
    # @mouse = {
    #   pos: {
    #     x: -100,
    #     y: -100
    #   },
    #   previous: {
    #     x: -100,
    #     y: -100
    #   },
    #   getSpeed: () ->
    #     dx = @previous.x - @pos.x
    #     dy = @previous.y - @pos.y
    #     Math.min(
    #       Math.sqrt(dx ** 2 + dy ** 2) / 6,
    #       20
    #     )
    # }
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

    # _this = @
    # window.onmousemove = (e) ->
    #   posx = e.clientX
    #   posy = e.clientY
    #   _this.mouse.previous.x = _this.mouse.pos.x
    #   _this.mouse.previous.y = _this.mouse.pos.y
    #   _this.mouse.pos.x = posx
    #   _this.mouse.pos.y = posy

  # stopMouse: () ->
  #   @mouse.previous.x = 0
  #   @mouse.previous.y = 0
  #   @mouse.pos.x = 0
  #   @mouse.pos.y = 0

  draw: (ctx, objs) ->
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
        for obj in objs
          particle.warp obj
          if obj.waves
            for wave in obj.waves
              particle.warp wave
        # particle.warp @mouse
