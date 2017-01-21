"usr strict"

Utils = require 'src/Utils'

module.exports = class Particle
  constructor: (x, y, speed, angle) ->
    @pos = {x: x, y: y}
    @velocity = {x: 0, y: 0}
    @friction = 0.95
    @vx = 1
    @vy = 1
    @alpha = 1
    @gravity = false
    @color = 'white'
    @radius = 2

    @setHeading(angle)
    @setSpeed(speed)

  getPos: () -> @pos

  getSpeed: () ->
    Math.sqrt @velocity.x ** 2, @velocity.y ** 2

  setSpeed: (speed) ->
    heading = @getHeading()
    @velocity.x = Math.cos(heading) * speed
    @velocity.y = Math.sin(heading) * speed

  getHeading: () ->
    Math.atan2 @velocity.y, @velocity.x

  setHeading: (heading) ->
    speed = @getSpeed()
    @velocity.x = Math.cos(heading) * speed
    @velocity.y = Math.sin(heading) * speed

  angleTo: (other) ->
    Math.atan2(other.pos.y - @pos.y, other.pos.x - @pos.x)

  draw: (ctx) ->
    ctx.globalAlpha = @alpha
    ctx.save()
    ctx.translate @pos.x, @pos.y
    ctx.rotate @getHeading()
    ctx.beginPath()
    ctx.fillStyle = @color
    ctx.polygon(
      0, 0,
      Math.min(
        @radius * (
          (Math.abs(@velocity.x) * Math.abs(@velocity.y)) / 8
        ),
        6
      ),
      0
    )
    ctx.fill()
    ctx.restore()
    ctx.globalAlpha = 1

  render: () ->
    @update()
    @updateSpring(@target) if @spring?

  update: () ->
    @velocity.x *= @friction
    @velocity.y *= @friction
    @pos.x += @velocity.x
    @pos.y += @velocity.y

  setSpring: (target) ->
    @target = target
    @k = 0.1
    @springLength = 0.8
    @friction = 0.90
    @spring = true

  updateSpring: () ->
    dx = @target.pos.x - @pos.x
    dy = @target.pos.y - @pos.y
    distance = Math.sqrt(dx ** 2 + dy ** 2)
    springForce = (distance - @springLength) * @k
    ax = dx / distance * springForce
    ay = dy / distance * springForce
    @velocity.x += ax
    @velocity.y += ay

  warp: (target) ->
    if Utils.distance(@, target) < target.getSpeed() * 10 and Utils.distance(@, @target) < 30
      @setHeading(Utils.getAngle(target, @))
      if Utils.distance(@, target) < 70
        @setSpeed(target.getSpeed())
