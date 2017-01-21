"use strict"

Particle = require 'src/Particle'

module.exports = class WarpGrid
  @GRID_COUNT = 50

  type: "WarpGrid"

  constructor: (size) ->
    @player = {
      pos: {
        x: -100,
        y: -100
      },
      previous: {
        x: -100,
        y: -100
      },
      getSpeed: () ->
        dx = @previous.x - @pos.x
        dy = @previous.y - @pos.y
        Math.min(
          Math.sqrt(dx ** 2 + dy ** 2) / 6,
          20
        )
    }
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
        particle.k = 0.1
        particle.springLength = 0.1
        particle.friction = 0.9
        particle.radius = .5
        particle.color = '#a5d4de'
        row.push particle
      @particles.push row

    _this = @
    window.onmousemove = (e) ->
      posx = e.clientX
      posy = e.clientY
      _this.player.previous.x = _this.player.pos.x
      _this.player.previous.y = _this.player.pos.y
      _this.player.pos.x = posx
      _this.player.pos.y = posy

  stopPlayer: () ->
    @player.previous.x = 0
    @player.previous.y = 0
    @player.pos.x = 0
    @player.pos.y = 0

  draw: (ctx) ->
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
        ctx.strokeStyle = '#2980b9'

        # color = tinycolor('hsl(220, 50%, 50%)').toHsl()
        # color.h += particle.getSpeed() * 10
        # ctx.strokeStyle = tinycolor(color).toHexString()

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

        particle.draw(ctx)
        particle.render()
        particle.warp(@player)
