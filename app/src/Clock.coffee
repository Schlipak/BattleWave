"use strict"

module.exports = class Clock
  constructor: () ->
    @time = getCurrentTime()

  deltaTime: () ->
    now   = getCurrentTime()
    delta = now - @time
    @time = now
    delta / 1000

  getCurrentTime = () ->
    (new Date()).getTime()

  getElapsedTime: () ->
    now   = getCurrentTime()
    delta = now - @time
    delta / 1000
