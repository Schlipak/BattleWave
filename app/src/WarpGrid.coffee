"use strict"

module.exports = class WarpGrid
  GRID_COUNT = 50

  type: "WarpGrid"

  constructor: (size) ->
    @points = []
    @lines = []
    for z in [0..GRID_COUNT]
      row = []
      for x in [0..GRID_COUNT]
        row.push new THREE.Vector3(
          x * (size / GRID_COUNT),
          0,
          z * (size / GRID_COUNT)
        )
      @points.push row
    for z in [0..GRID_COUNT]
      row = []
      for x in [1..GRID_COUNT]
        lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(
          @points[z][x - 1]
          @points[z][x]
        )
        line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial(
          color: 0xFFFFFF,
          linewidth: 2
        ))
        line.position.y = 0
        row.push line
      @lines.push row
    for x in [0..GRID_COUNT]
      column = []
      for z in [1..GRID_COUNT]
        lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(
          @points[z - 1][x]
          @points[z][x]
        )
        line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial(
          color: 0xFFFFFF,
          linewidth: 2
        ))
        line.position.y = 0
        column.push line
      @lines.push column

    # @lines[30][30].geometry.vertices[1].y = 100
    # @geo = new THREE.Geometry()
    # for z in [0..GRID_COUNT]
    #   for x in [0..GRID_COUNT]
    #     if z % 2 == 0
    #       @geo.vertices.push(new THREE.Vector3(
    #         x * (size / GRID_COUNT),
    #         0,
    #         z * (size / GRID_COUNT)
    #       ))
    #     else
    #       @geo.vertices.push(new THREE.Vector3(
    #         size - (x * (size / GRID_COUNT)),
    #         0,
    #         z * (size / GRID_COUNT)
    #       ))
    # for x in [GRID_COUNT..0]
    #   for z in [GRID_COUNT..0]
    #     if x % 2 == 0
    #       @geo.vertices.push(new THREE.Vector3(
    #         x * (size / GRID_COUNT),
    #         0,
    #         z * (size / GRID_COUNT)
    #       ))
    #     else
    #       @geo.vertices.push(new THREE.Vector3(
    #         x * (size / GRID_COUNT),
    #         0,
    #         size - (z * (size / GRID_COUNT))
    #       ))
    # @lines = new THREE.Line(@geo, new THREE.LineBasicMaterial(
    #   color: 0xFFFFFF
    #   linewidth: 2
    # ))
    # @lines.position.y = 0

  add: (scene) ->
    for row in @lines
      for line in row
        scene.add line
