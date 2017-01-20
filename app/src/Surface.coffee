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
    @camera = new THREE.PerspectiveCamera(
      45, @width(), @height(),
      0.1, 10000
    )
    @scene = new THREE.Scene()
    @scene.add @camera
    @light = new THREE.AmbientLight(0xFFFFFF)
    @scene.add @light

    @axis = new THREE.AxisHelper(75)
    @scene.add @axis

    @cube = new THREE.Mesh(
      new THREE.CubeGeometry(200, 200, 200),
      new THREE.MeshNormalMaterial()
    )
    @scene.add @cube


  setupComposer: () ->
    console.log '[Surface] Setting up composer'
    @composer = new THREE.EffectComposer(@renderer)
    @composer.addPass(new THREE.RenderPass(@scene, @camera))
    @fxaa = new THREE.ShaderPass(THREE.FXAAShader)
    @fxaa.uniforms['resolution'].value = new THREE.Vector2(
      1 / @width(), 1 / @height()
    )
    @composer.addPass(@fxaa)
    copy = new THREE.ShaderPass(THREE.CopyShader)
    copy.renderToScreen = true
    @composer.addPass(copy)

  width: () ->
    window.innerWidth

  height: () ->
    window.innerHeight

  clear: () -> @renderer.clear()

  add: (obj) ->
    console.log "[Surface] Adding object #{obj.inner().type}"
    @scene.add obj.inner()

  render: () ->
    # @camera.rotation.y += 0.001
    @composer.render()

  resizeScene = (win) ->
    console.log '[Surface] Resizing'
    height  = win.innerHeight
    width   = win.innerWidth

    @cube.position.x = width / 2
    @cube.position.y = 0
    @cube.position.z = height / 2

    @camera.position.x = width / 2
    @camera.position.y = 800
    @camera.position.z = height / 2
    @camera.lookAt new THREE.Vector3(
      width / 2, 0, height / 2
    )
    @camera.aspect = width / height
    @camera.updateProjectionMatrix()

    @renderer.setSize width, height
    @composer.setSize width, height

    if @fxaa
      @fxaa.uniforms['resolution'].value = new THREE.Vector2(
        1 / width, 1 / height
      )

  registerResize = () ->
    _this = @
    window.addEventListener('resize', (e) ->
      (resizeScene.bind(_this))(e.target)
    )
