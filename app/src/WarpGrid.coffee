"use strict"

module.exports = class WarpGrid
  @GRID_COUNT = 50

  type: "WarpGrid"

  constructor: (size) ->
    @points = []
    for y in [0..WarpGrid.GRID_COUNT]
      row = []
      for x in [0..WarpGrid.GRID_COUNT]
        xcoord = x * (size / WarpGrid.GRID_COUNT)
        ycoord = y * (size / WarpGrid.GRID_COUNT)
        row.push {
          x: x,
          y: y,
          originX: xcoord,
          originY: ycoord,
          currentX: xcoord,
          currentY: ycoord,
          weight: 0
        }
      @points.push row

  dist = (left, right) ->
    dx = (right.originX - left.originX) / WarpGrid.GRID_COUNT
    dy = (right.originY - left.originY) / WarpGrid.GRID_COUNT
    {
      dx: dx,
      dy: dy,
      dist: Math.sqrt(dx * dx + dy * dy)
    }

  setWavePoint: (origin) ->
    for row in @points
      for pt in row
        distance = dist(origin, pt)
        pt.weight = 100 - (Math.abs(distance.dist) * 30)
        pt.weight = 0 if pt.weight < 0

        # pt.currentY = pt.originY + dy
        # pt.currentX = pt.originX + dx

  @computeColor: (ctx, left, right) ->
    grad = ctx.createLinearGradient(
      0, 0,
      right.currentX - left.currentX,
      right.currentY - left.currentY
    )

    hue = Math.round(280 - left.weight)
    light = 40 + Math.round(left.weight * 0.6)
    colLeft = tinycolor("hsl(#{hue}, #{light}%, #{light}%)").toHexString()

    hue = Math.round(280 - right.weight)
    light = 40 + Math.round(right.weight * 0.6)
    colRight = tinycolor("hsl(#{hue}, #{light}%, #{light}%)").toHexString()

    grad.addColorStop 0, colLeft
    grad.addColorStop 1, colRight

    grad

  draw: (ctx) ->
    ctx.lineWidth = 1
    for row in @points
      previous = row[0]
      for pt in row
        ctx.strokeStyle = WarpGrid.computeColor(ctx, previous, pt)
        ctx.beginPath()
        ctx.moveTo(previous.currentX, previous.currentY)
        continue if pt == previous
        ctx.lineTo(pt.currentX, pt.currentY)
        ctx.stroke()
        previous = pt
    for x in [0..WarpGrid.GRID_COUNT]
      previous = @points[0][x]
      for y in [0..WarpGrid.GRID_COUNT]
        pt = @points[y][x]
        continue if pt == previous
        ctx.strokeStyle = WarpGrid.computeColor(ctx, previous, pt)
        ctx.beginPath()
        ctx.moveTo(previous.currentX, previous.currentY)
        ctx.lineTo(pt.currentX, pt.currentY)
        ctx.stroke()
        previous = pt
