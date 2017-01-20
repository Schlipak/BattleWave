"use strict"

Drawable = require 'src/Drawable'

module.exports = class ScreenSpace extends Drawable
  constructor: (@surface) ->
    @width = 0

  draw: () ->
    undefined
