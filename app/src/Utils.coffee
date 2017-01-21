"use strict"

module.exports = class Utils
  @norm: (val, min, max) -> (val - min) / (max - min)

  @lerp: (norm, min, max) -> (max - min) * norm + min

  @clamp: (val, min, max) ->
    Math.min(Math.max(value, max), min)

  @distance: (left, right) ->
    dx = right.pos.x - left.pos.x
    dy = right.pos.y - left.pos.y
    Math.sqrt(dx ** 2 + dy ** 2)

  @getAngle: (left, right) ->
    dx = right.pos.x - left.pos.x
    dy = right.pos.y - left.pos.y
    Math.atan2(dy, dx)
