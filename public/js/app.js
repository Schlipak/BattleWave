(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("BattleWave.coffee", function(exports, require, module) {
"use strict";
var BattleWave, Clock, ScreenSpace, Surface, WarpGrid;

Clock = require('src/Clock');

Surface = require('src/Surface');

ScreenSpace = require('src/ScreenSpace');

WarpGrid = require('src/WarpGrid');

module.exports = BattleWave = (function() {
  function BattleWave(target1) {
    this.target = target1;
    this.clock = new Clock();
    this.surface = new Surface(this.target);
    this.screen = new ScreenSpace(this.surface);
    this.grid = new WarpGrid(this.surface.width(), this.surface.height());
    this.surface.add(this.grid);
    this.loopId = null;
  }

  BattleWave.prototype.deltaTime = function() {
    return this.clock.deltaTime();
  };

  BattleWave.prototype.start = function() {
    console.log('[BattleWave] Starting');
    return this.loopId = requestAnimationFrame(this.gameLoop.bind(this));
  };

  BattleWave.prototype.stop = function() {
    console.log('[BattleWave] Stopping');
    return cancelAnimationFrame(this.loopId);
  };

  BattleWave.prototype.gameLoop = function() {
    this.surface.clear();
    this.surface.render();
    return this.loopId = requestAnimationFrame(this.gameLoop.bind(this));
  };

  return BattleWave;

})();

document.addEventListener('DOMContentLoaded', function() {
  var bw, target;
  console.log('[BattleWave] Initializing');
  target = document.getElementById('target');
  bw = new BattleWave(target);
  return bw.start();
});

});

require.register("src/Clock.coffee", function(exports, require, module) {
"use strict";
var Clock;

module.exports = Clock = (function() {
  var getCurrentTime;

  function Clock() {
    this.time = getCurrentTime();
  }

  Clock.prototype.deltaTime = function() {
    var delta, now;
    now = getCurrentTime();
    delta = now - this.time;
    this.time = now;
    return delta / 1000;
  };

  getCurrentTime = function() {
    return (new Date()).getTime();
  };

  return Clock;

})();

});

require.register("src/Drawable.coffee", function(exports, require, module) {
"use strict";
var Drawable;

module.exports = Drawable = (function() {
  function Drawable() {
    null;
  }

  Drawable.prototype.draw = function(surface) {
    return null;
  };

  return Drawable;

})();

});

require.register("src/ScreenSpace.coffee", function(exports, require, module) {
"use strict";
var Drawable, ScreenSpace,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Drawable = require('src/Drawable');

module.exports = ScreenSpace = (function(superClass) {
  extend(ScreenSpace, superClass);

  function ScreenSpace(surface) {
    this.surface = surface;
    this.width = 0;
  }

  ScreenSpace.prototype.draw = function() {
    return void 0;
  };

  return ScreenSpace;

})(Drawable);

});

require.register("src/Surface.coffee", function(exports, require, module) {
"use strict";
var Surface;

module.exports = Surface = (function() {
  var registerResize, resizeScene;

  function Surface(target) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x1A1A1A, 1);
    this.renderer.autoClear = false;
    this.createScene();
    this.setupComposer();
    (registerResize.bind(this))();
    (resizeScene.bind(this))(window);
    target.appendChild(this.renderer.domElement);
  }

  Surface.prototype.createScene = function() {
    console.log('[Surface] Creating scene');
    this.camera = new THREE.PerspectiveCamera(45, this.width(), this.height(), 0.1, 10000);
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.light = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.light);
    this.axis = new THREE.AxisHelper(75);
    this.scene.add(this.axis);
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
    return this.scene.add(this.cube);
  };

  Surface.prototype.setupComposer = function() {
    var copy;
    console.log('[Surface] Setting up composer');
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    this.fxaa.uniforms['resolution'].value = new THREE.Vector2(1 / this.width(), 1 / this.height());
    this.composer.addPass(this.fxaa);
    copy = new THREE.ShaderPass(THREE.CopyShader);
    copy.renderToScreen = true;
    return this.composer.addPass(copy);
  };

  Surface.prototype.width = function() {
    return window.innerWidth;
  };

  Surface.prototype.height = function() {
    return window.innerHeight;
  };

  Surface.prototype.clear = function() {
    return this.renderer.clear();
  };

  Surface.prototype.add = function(obj) {
    console.log("[Surface] Adding object " + (obj.inner().type));
    return this.scene.add(obj.inner());
  };

  Surface.prototype.render = function() {
    return this.composer.render();
  };

  resizeScene = function(win) {
    var height, width;
    console.log('[Surface] Resizing');
    height = win.innerHeight;
    width = win.innerWidth;
    this.cube.position.x = width / 2;
    this.cube.position.y = 0;
    this.cube.position.z = height / 2;
    this.camera.position.x = width / 2;
    this.camera.position.y = 800;
    this.camera.position.z = height / 2;
    this.camera.lookAt(new THREE.Vector3(width / 2, 0, height / 2));
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    if (this.fxaa) {
      return this.fxaa.uniforms['resolution'].value = new THREE.Vector2(1 / width, 1 / height);
    }
  };

  registerResize = function() {
    var _this;
    _this = this;
    return window.addEventListener('resize', function(e) {
      return (resizeScene.bind(_this))(e.target);
    });
  };

  return Surface;

})();

});

require.register("src/WarpGrid.coffee", function(exports, require, module) {
"use strict";
var WarpGrid;

module.exports = WarpGrid = (function() {
  var GRID_COUNT;

  GRID_COUNT = 150;

  function WarpGrid(width, height) {
    var i, j, ref, ref1, x, z;
    this.geo = new THREE.Geometry();
    for (z = i = 0, ref = GRID_COUNT; 0 <= ref ? i <= ref : i >= ref; z = 0 <= ref ? ++i : --i) {
      for (x = j = 0, ref1 = GRID_COUNT; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
        this.geo.vertices.push(new THREE.Vector3(x * (width / GRID_COUNT), 0, z * (width / GRID_COUNT)));
      }
    }
    this.lines = new THREE.Line(this.geo, new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 1
    }));
  }

  WarpGrid.prototype.inner = function() {
    return this.lines;
  };

  return WarpGrid;

})();

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

/* jshint ignore:start */
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(function(link) {
          var val = link.getAttribute('data-autoreload');
          return link.href && val != 'false';
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    },

    javascript: function(){
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function(script) { return script.text }).filter(function(text) { return text.length > 0 });
      var srcScripts = scripts.filter(function(script) { return script.src });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function(script) { eval(script); });
        }
      }

      srcScripts
        .forEach(function(script) {
          var src = script.src;
          script.remove();
          var newScript = document.createElement('script');
          newScript.src = cacheBuster(src);
          newScript.async = true;
          newScript.onload = onLoad;
          document.head.appendChild(newScript);
        });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;
//# sourceMappingURL=app.js.map