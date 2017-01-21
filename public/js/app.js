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
var BattleWave, Clock, Surface, WarpGrid;

Clock = require('src/Clock');

Surface = require('src/Surface');

WarpGrid = require('src/WarpGrid');

module.exports = BattleWave = (function() {
  function BattleWave(target1) {
    this.target = target1;
    this.clock = new Clock();
    this.surface = new Surface(this.target);
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

require.register("src/Surface.coffee", function(exports, require, module) {
"use strict";
var Surface, WarpGrid;

WarpGrid = require('src/WarpGrid');

module.exports = Surface = (function() {
  var registerResize, resizeScene;

  function Surface(target) {
    var _this;
    this.canvas = document.createElement('CANVAS');
    target.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.objects = [];
    this.setupComposer();
    (registerResize.bind(this))();
    (resizeScene.bind(this))(window);
    this.grid = new WarpGrid(this.width(), this.height());
    this.add(this.grid);
    _this = this;
    this.canvas.onmousemove = function(e) {
      var posx, posy;
      posx = e.clientX;
      posy = e.clientY;
      return _this.grid.setWavePoint({
        originX: posx,
        originY: posy
      });
    };
  }

  Surface.prototype.setupComposer = function() {
    return console.log('[Surface] Setting up composer');
  };

  Surface.prototype.width = function() {
    return this.canvas.width;
  };

  Surface.prototype.height = function() {
    return this.canvas.height;
  };

  Surface.prototype.clear = function() {
    return this.context.clearRect(0, 0, this.width(), this.height());
  };

  Surface.prototype.add = function(obj) {
    return this.objects.push(obj);
  };

  Surface.prototype.render = function() {
    var i, len, obj, ref, results;
    this.context.fillStyle = '#212121';
    this.context.fillRect(0, 0, this.width(), this.height());
    ref = this.objects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      obj = ref[i];
      results.push(obj.draw(this.context));
    }
    return results;
  };

  resizeScene = function(win) {
    var height, width;
    console.log('[Surface] Resizing');
    height = win.innerHeight;
    width = win.innerWidth;
    this.canvas.width = width;
    return this.canvas.height = height;
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
  var dist;

  WarpGrid.GRID_COUNT = 50;

  WarpGrid.prototype.type = "WarpGrid";

  function WarpGrid(size) {
    var i, j, ref, ref1, row, x, xcoord, y, ycoord;
    this.points = [];
    for (y = i = 0, ref = WarpGrid.GRID_COUNT; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
      row = [];
      for (x = j = 0, ref1 = WarpGrid.GRID_COUNT; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
        xcoord = x * (size / WarpGrid.GRID_COUNT);
        ycoord = y * (size / WarpGrid.GRID_COUNT);
        row.push({
          x: x,
          y: y,
          originX: xcoord,
          originY: ycoord,
          currentX: xcoord,
          currentY: ycoord,
          weight: 0
        });
      }
      this.points.push(row);
    }
  }

  dist = function(left, right) {
    var dx, dy;
    dx = (right.originX - left.originX) / WarpGrid.GRID_COUNT;
    dy = (right.originY - left.originY) / WarpGrid.GRID_COUNT;
    return {
      dx: dx,
      dy: dy,
      dist: Math.sqrt(dx * dx + dy * dy)
    };
  };

  WarpGrid.prototype.setWavePoint = function(origin) {
    var distance, i, len, pt, ref, results, row;
    ref = this.points;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      results.push((function() {
        var j, len1, results1;
        results1 = [];
        for (j = 0, len1 = row.length; j < len1; j++) {
          pt = row[j];
          distance = dist(origin, pt);
          pt.weight = 100 - (Math.abs(distance.dist) * 30);
          if (pt.weight < 0) {
            results1.push(pt.weight = 0);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  WarpGrid.computeColor = function(ctx, left, right) {
    var colLeft, colRight, grad, hue, light;
    grad = ctx.createLinearGradient(0, 0, right.currentX - left.currentX, right.currentY - left.currentY);
    hue = Math.round(280 - left.weight);
    light = 40 + Math.round(left.weight * 0.6);
    colLeft = tinycolor("hsl(" + hue + ", " + light + "%, " + light + "%)").toHexString();
    hue = Math.round(280 - right.weight);
    light = 40 + Math.round(right.weight * 0.6);
    colRight = tinycolor("hsl(" + hue + ", " + light + "%, " + light + "%)").toHexString();
    grad.addColorStop(0, colLeft);
    grad.addColorStop(1, colRight);
    return grad;
  };

  WarpGrid.prototype.draw = function(ctx) {
    var i, j, k, len, len1, previous, pt, ref, ref1, results, row, x, y;
    ctx.lineWidth = 1;
    ref = this.points;
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      previous = row[0];
      for (j = 0, len1 = row.length; j < len1; j++) {
        pt = row[j];
        ctx.strokeStyle = WarpGrid.computeColor(ctx, previous, pt);
        ctx.beginPath();
        ctx.moveTo(previous.currentX, previous.currentY);
        if (pt === previous) {
          continue;
        }
        ctx.lineTo(pt.currentX, pt.currentY);
        ctx.stroke();
        previous = pt;
      }
    }
    results = [];
    for (x = k = 0, ref1 = WarpGrid.GRID_COUNT; 0 <= ref1 ? k <= ref1 : k >= ref1; x = 0 <= ref1 ? ++k : --k) {
      previous = this.points[0][x];
      results.push((function() {
        var l, ref2, results1;
        results1 = [];
        for (y = l = 0, ref2 = WarpGrid.GRID_COUNT; 0 <= ref2 ? l <= ref2 : l >= ref2; y = 0 <= ref2 ? ++l : --l) {
          pt = this.points[y][x];
          if (pt === previous) {
            continue;
          }
          ctx.strokeStyle = WarpGrid.computeColor(ctx, previous, pt);
          ctx.beginPath();
          ctx.moveTo(previous.currentX, previous.currentY);
          ctx.lineTo(pt.currentX, pt.currentY);
          ctx.stroke();
          results1.push(previous = pt);
        }
        return results1;
      }).call(this));
    }
    return results;
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