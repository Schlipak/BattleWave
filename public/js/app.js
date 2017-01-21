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

window.CanvasRenderingContext2D.prototype.polygon = function(x, y, radius, sides) {
  var angle, i, j, ref;
  if (sides > 2) {
    for (i = j = 0, ref = sides; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      angle = (Math.PI * 2 / sides * i) - Math.PI / 2;
      this.lineTo(Math.cos(angle) * radius + x, Math.sin(angle) * radius + y);
    }
    angle = (Math.PI * 2 / sides * sides) - Math.PI / 2;
    return this.lineTo(Math.cos(angle) * radius + x, Math.sin(angle) * radius + y);
  } else {
    return this.arc(x, y, radius, 0, 2 * Math.PI);
  }
};

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

require.register("src/Particle.coffee", function(exports, require, module) {
"usr strict";
var Particle, Utils;

Utils = require('src/Utils');

module.exports = Particle = (function() {
  function Particle(x, y, speed, angle) {
    this.pos = {
      x: x,
      y: y
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.friction = 0.95;
    this.vx = 1;
    this.vy = 1;
    this.alpha = 1;
    this.gravity = false;
    this.color = 'white';
    this.radius = 2;
    this.setHeading(angle);
    this.setSpeed(speed);
  }

  Particle.prototype.getPos = function() {
    return this.pos;
  };

  Particle.prototype.getSpeed = function() {
    return Math.sqrt(Math.pow(this.velocity.x, 2), Math.pow(this.velocity.y, 2));
  };

  Particle.prototype.setSpeed = function(speed) {
    var heading;
    heading = this.getHeading();
    this.velocity.x = Math.cos(heading) * speed;
    return this.velocity.y = Math.sin(heading) * speed;
  };

  Particle.prototype.getHeading = function() {
    return Math.atan2(this.velocity.y, this.velocity.x);
  };

  Particle.prototype.setHeading = function(heading) {
    var speed;
    speed = this.getSpeed();
    this.velocity.x = Math.cos(heading) * speed;
    return this.velocity.y = Math.sin(heading) * speed;
  };

  Particle.prototype.angleTo = function(other) {
    return Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);
  };

  Particle.prototype.draw = function(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.getHeading());
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.polygon(0, 0, Math.min(this.radius * ((Math.abs(this.velocity.x) * Math.abs(this.velocity.y)) / 8), 6), 0);
    ctx.fill();
    ctx.restore();
    return ctx.globalAlpha = 1;
  };

  Particle.prototype.render = function() {
    this.update();
    if (this.spring != null) {
      return this.updateSpring(this.target);
    }
  };

  Particle.prototype.update = function() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.pos.x += this.velocity.x;
    return this.pos.y += this.velocity.y;
  };

  Particle.prototype.setSpring = function(target) {
    this.target = target;
    this.k = 0.1;
    this.springLength = 0.8;
    this.friction = 0.90;
    return this.spring = true;
  };

  Particle.prototype.updateSpring = function() {
    var ax, ay, distance, dx, dy, springForce;
    dx = this.target.pos.x - this.pos.x;
    dy = this.target.pos.y - this.pos.y;
    distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    springForce = (distance - this.springLength) * this.k;
    ax = dx / distance * springForce;
    ay = dy / distance * springForce;
    this.velocity.x += ax;
    return this.velocity.y += ay;
  };

  Particle.prototype.warp = function(target) {
    if (Utils.distance(this, target) < target.getSpeed() * 10 && Utils.distance(this, this.target) < 30) {
      this.setHeading(Utils.getAngle(target, this));
      if (Utils.distance(this, target) < 70) {
        return this.setSpeed(target.getSpeed());
      }
    }
  };

  return Particle;

})();

});

require.register("src/Player.coffee", function(exports, require, module) {
"use strict";
var Player;

module.exports = Player = (function() {
  var setupControls;

  function Player(playerNumber) {
    this.playerNumber = playerNumber;
    this.pos = {
      x: 0,
      y: 0
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.friction = 0.9;
    (setupControls.bind(this))();
  }

  setupControls = function() {
    return void 0;
  };

  Player.prototype.update = function() {
    return void 0;
  };

  Player.prototype.draw = function(ctx) {
    return void 0;
  };

  return Player;

})();

});

require.register("src/Surface.coffee", function(exports, require, module) {
"use strict";
var Surface, WarpGrid;

WarpGrid = require('src/WarpGrid');

module.exports = Surface = (function() {
  var registerResize, resizeScene;

  function Surface(target) {
    this.canvas = document.createElement('CANVAS');
    target.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.objects = [];
    this.setupComposer();
    (registerResize.bind(this))();
    (resizeScene.bind(this))(window);
    this.grid = new WarpGrid(this.width(), this.height());
    this.add(this.grid);
    this.vignette = this.context.createRadialGradient(this.width() / 2, this.height() / 2, 100, this.width() / 2, this.height() / 2, this.width() / 2);
    this.vignette.addColorStop(0, "transparent");
    this.vignette.addColorStop(1, "rgba(0, 0, 0, .4)");
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
    var i, len, obj, ref;
    this.context.save();
    this.context.fillStyle = "#20172a";
    this.context.fillRect(0, 0, this.width(), this.height());
    ref = this.objects;
    for (i = 0, len = ref.length; i < len; i++) {
      obj = ref[i];
      obj.draw(this.context);
    }
    this.context.restore();
    this.context.fillStyle = this.vignette;
    return this.context.fillRect(0, 0, this.width(), this.height());
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

require.register("src/Utils.coffee", function(exports, require, module) {
"use strict";
var Utils;

module.exports = Utils = (function() {
  function Utils() {}

  Utils.norm = function(val, min, max) {
    return (val - min) / (max - min);
  };

  Utils.lerp = function(norm, min, max) {
    return (max - min) * norm + min;
  };

  Utils.clamp = function(val, min, max) {
    return Math.min(Math.max(value, max), min);
  };

  Utils.distance = function(left, right) {
    var dx, dy;
    dx = right.pos.x - left.pos.x;
    dy = right.pos.y - left.pos.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  };

  Utils.getAngle = function(left, right) {
    var dx, dy;
    dx = right.pos.x - left.pos.x;
    dy = right.pos.y - left.pos.y;
    return Math.atan2(dy, dx);
  };

  return Utils;

})();

});

require.register("src/WarpGrid.coffee", function(exports, require, module) {
"use strict";
var Particle, WarpGrid;

Particle = require('src/Particle');

module.exports = WarpGrid = (function() {
  WarpGrid.GRID_COUNT = 50;

  WarpGrid.prototype.type = "WarpGrid";

  function WarpGrid(size) {
    var _this, i, j, particle, ref, ref1, row, x, y;
    this.player = {
      pos: {
        x: -100,
        y: -100
      },
      previous: {
        x: -100,
        y: -100
      },
      getSpeed: function() {
        var dx, dy;
        dx = this.previous.x - this.pos.x;
        dy = this.previous.y - this.pos.y;
        return Math.min(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / 6, 20);
      }
    };
    this.particles = [];
    for (y = i = 0, ref = WarpGrid.GRID_COUNT; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
      row = [];
      for (x = j = 0, ref1 = WarpGrid.GRID_COUNT; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
        particle = new Particle(x * (size / WarpGrid.GRID_COUNT), y * (size / WarpGrid.GRID_COUNT), 1, 0);
        particle.target = {
          pos: {
            x: x * (size / WarpGrid.GRID_COUNT),
            y: y * (size / WarpGrid.GRID_COUNT)
          }
        };
        particle.setSpring(particle.target);
        particle.k = 0.1;
        particle.springLength = 0.1;
        particle.friction = 0.9;
        particle.radius = .5;
        particle.color = '#a5d4de';
        row.push(particle);
      }
      this.particles.push(row);
    }
    _this = this;
    window.onmousemove = function(e) {
      var posx, posy;
      posx = e.clientX;
      posy = e.clientY;
      _this.player.previous.x = _this.player.pos.x;
      _this.player.previous.y = _this.player.pos.y;
      _this.player.pos.x = posx;
      return _this.player.pos.y = posy;
    };
  }

  WarpGrid.prototype.stopPlayer = function() {
    this.player.previous.x = 0;
    this.player.previous.y = 0;
    this.player.pos.x = 0;
    return this.player.pos.y = 0;
  };

  WarpGrid.prototype.draw = function(ctx) {
    var bottom, i, particle, ref, results, right, x, y;
    results = [];
    for (y = i = 0, ref = WarpGrid.GRID_COUNT; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
      results.push((function() {
        var j, ref1, results1;
        results1 = [];
        for (x = j = 0, ref1 = WarpGrid.GRID_COUNT; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
          particle = this.particles[y][x];
          right = null;
          if (x + 1 <= WarpGrid.GRID_COUNT) {
            right = this.particles[y][x + 1];
          }
          bottom = null;
          if (y + 1 <= WarpGrid.GRID_COUNT) {
            bottom = this.particles[y + 1][x];
          }
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.1 + particle.getSpeed();
          ctx.strokeStyle = '#2980b9';
          if (right != null) {
            ctx.beginPath();
            ctx.moveTo(particle.pos.x, particle.pos.y);
            ctx.lineTo(right.pos.x, right.pos.y);
            ctx.closePath();
            ctx.stroke();
          }
          if (bottom != null) {
            ctx.beginPath();
            ctx.moveTo(particle.pos.x, particle.pos.y);
            ctx.lineTo(bottom.pos.x, bottom.pos.y);
            ctx.closePath();
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'white';
          particle.draw(ctx);
          particle.render();
          results1.push(particle.warp(this.player));
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