"use strict"

module.exports = class Clock
  constructor: () ->
    @time = getCurrentTime()

  deltaTime: () ->
    now   = getCurrentTime()
    delta = now - @time
    @time = now
    delta

  getCurrentTime = () ->
    (new Date()).getTime()
