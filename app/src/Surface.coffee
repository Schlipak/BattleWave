"use strict"

module.exports = class Surface
  constructor: (target) ->
    @renderer = new THREE.WebGLRenderer()
    @renderer.setClearColor(0x1A1A1A, 1)
    @renderer.autoClear = false

    @createScene()
    @setupComposer()
    (registerResize.bind(@))()
    (resizeScene.bind(@))(window)

    target.appendChild @renderer.domElement

  createScene: () ->
    console.log '[Surface] Creating scene'
    @gridCam = new THREE.PerspectiveCamera(
      90, @width(), @height(),
      0.1, 10000
    )
    @gridScene = new THREE.Scene()
    @gridScene.add @gridCam
    @light = new THREE.AmbientLight(0xFFFFFF)
    @gridScene.add @light

    @objectScene = new THREE.Scene()
    @objectCam = new THREE.PerspectiveCamera(
      90, @width(), @height(),
      0.1, 10000
    )
    @objectScene.add @objectCam
    @objectScene.add @light
    @cube = new THREE.Mesh(
      new THREE.CubeGeometry(200, 200, 200),
      new THREE.MeshNormalMaterial()
    )
    @objectScene.add @cube

  setupComposer: () ->
    console.log '[Surface] Setting up composer'

    @gridComposer = new THREE.EffectComposer(@renderer)
    @gridComposer.addPass(new THREE.RenderPass(@gridScene, @gridCam))
    @rgbShift = new THREE.ShaderPass(THREE.RGBShiftShader)
    @rgbShift.uniforms['amount'].value = 0.0014
    @gridComposer.addPass(@rgbShift)
    @fxaa = new THREE.ShaderPass(THREE.FXAAShader)
    @fxaa.uniforms['resolution'].value = new THREE.Vector2(
      1 / @width(), 1 / @height()
    )
    @gridComposer.addPass(@fxaa)
    copy = new THREE.ShaderPass(THREE.CopyShader)
    copy.renderToScreen = true
    @gridComposer.addPass(copy)

    @objComposer = new THREE.EffectComposer(@renderer)
    @objComposer.addPass(
      new THREE.RenderPass(@objectScene, @objectCam)
    )
    copy = new THREE.ShaderPass(THREE.CopyShader)
    copy.renderToScreen = true
    @objComposer.addPass(copy)

  width: () ->
    window.innerWidth

  height: () ->
    window.innerHeight

  clear: () -> @renderer.clear()

  add: (obj) ->
    console.log "[Surface] Adding object #{obj.type}"
    obj.add(@gridScene)

  render: () ->
    @gridComposer.render()
    @objComposer.render()

  resizeScene = (win) ->
    console.log '[Surface] Resizing'
    height  = win.innerHeight
    width   = win.innerWidth

    @cube.position.x = width / 3
    @cube.position.y = 0
    @cube.position.z = (height / 2) + 1
    @cube.rotation.y = Math.PI / 4

    @gridCam.position.x = width / 2
    @gridCam.position.y = 900
    @gridCam.position.z = height / 2
    @gridCam.lookAt new THREE.Vector3(
      width / 2, 0, height / 2
    )
    @gridCam.aspect = width / height
    @gridCam.updateProjectionMatrix()

    @objectCam.position.x = width / 2
    @objectCam.position.y = 900
    @objectCam.position.z = height / 2
    @objectCam.lookAt new THREE.Vector3(
      width / 2, 0, height / 2
    )
    @objectCam.aspect = width / height
    @objectCam.updateProjectionMatrix()

    @renderer.setSize width, height
    @gridComposer.setSize width, height
    @objComposer.setSize width, height

    if @fxaa
      @fxaa.uniforms['resolution'].value = new THREE.Vector2(
        1 / width, 1 / height
      )

  registerResize = () ->
    _this = @
    window.addEventListener('resize', (e) ->
      (resizeScene.bind(_this))(e.target)
    )
