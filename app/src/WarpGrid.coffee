"use strict"

module.exports = class WarpGrid
  GRID_COUNT = 150

  constructor: (width, height) ->
    @geo = new THREE.Geometry()
    for z in [0..GRID_COUNT]
      for x in [0..GRID_COUNT]
        @geo.vertices.push(
          new THREE.Vector3(
            x * (width / GRID_COUNT),
            0,
            z * (width / GRID_COUNT)
          )
        )
    @lines = new THREE.Line(@geo, new THREE.LineBasicMaterial(
      color: 0xFFFFFF
      linewidth: 1
    ))

  inner: () -> @lines
