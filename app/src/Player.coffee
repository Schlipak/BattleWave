"use strict"

module.exports = class Player
  constructor: (@playerNumber) ->
    @pos = {x: 0, y: 0}
    @velocity = {x: 0, y: 0}
    @friction = 0.9
    
    (setupControls.bind(@))()

  setupControls = () ->
    undefined

  update: () ->
    undefined

  draw: (ctx) ->
    undefined
