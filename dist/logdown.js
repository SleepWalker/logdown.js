(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
/* global console, module, window, document, navigator, process */

var lastUsedColorIndex = 0
// Tomorrow Night Eighties colors
// https://github.com/chriskempson/tomorrow-theme#tomorrow-night-eighties
var colors = [
  '#F2777A',
  '#F99157',
  '#FFCC66',
  '#99CC99',
  '#66CCCC',
  '#6699CC',
  '#CC99CC'
]
// Taken from ansi-styles npm module
// https://github.com/sindresorhus/ansi-styles/blob/master/index.js
var ansiColors = {
  modifiers: {
    reset: [0, 0],
    bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  colors: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39]
  },
  bgColors: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49]
  }
}
var filterRegExps = []

function Logdown (prefix, opts) {
  if (!(this instanceof Logdown)) {
    return new Logdown(prefix, opts)
  }

  this.opts = normalizeOpts(prefix, opts)

  if (isPrefixAlreadyInUse(this.opts.prefix, Logdown._instances)) {
    return getInstanceByPrefix(this.opts.prefix, Logdown._instances)
  }

  Logdown._instances.push(this)
  alignPrefixes(Logdown._instances)
  updateEnabledDisabled()

  return this
}

//
// Static
//

Logdown._instances = []

Logdown.enable = function () {
  Array.prototype.forEach.call(arguments, function (str) {
    if (str[0] === '-') {
      Logdown.disable(str.substr(1))
    }

    var regExp = prepareRegExpForPrefixSearch(str)

    if (str === '*') {
      filterRegExps = []
    } else {
      filterRegExps.push({
        type: 'enable',
        regExp: regExp
      })
    }
  })
}

Logdown.disable = function () {
  Array.prototype.forEach.call(arguments, function (str) {
    if (str[0] === '-') {
      Logdown.enable(str.substr(1))
    }

    var regExp = prepareRegExpForPrefixSearch(str)

    if (str === '*') {
      filterRegExps = [{
        type: 'disable',
        regExp: regExp
      }]
    } else {
      filterRegExps.push({
        type: 'disable',
        regExp: regExp
      })
    }
  })
}

//
// Public
//

var methods = ['debug', 'log', 'info', 'warn', 'error']
methods.forEach(function (method) {
  Logdown.prototype[method] = function () {
    if (isDisabled(this)) {
      return
    }

    var preparedOutput
    var args = Array.prototype.slice.call(arguments, 0)

    if (isBrowser()) {
      preparedOutput = prepareOutputToBrowser(args, this)

      // IE9 workaround
      // http://stackoverflow.com/questions/5538972/
      //  console-log-apply-not-working-in-ie9
      Function.prototype.apply.call(
        console[method] || console.log,
        console,
        preparedOutput
      )
    } else if (isNode()) {
      preparedOutput = prepareOutputToNode(args, method, this)
      ;(console[method] || console.log).apply(
        console,
        preparedOutput
      )
    }
  }
})

//
// Private
//

function normalizeOpts (prefix, opts) {
  if (typeof prefix === 'object') opts = prefix
  opts = opts || {}

  if (typeof prefix !== 'string') prefix = opts.prefix || ''
  prefix = sanitizeStringToBrowser(prefix)

  var alignOutput = Boolean(opts.alignOutput)
  var markdown = opts.markdown === undefined ? true : Boolean(opts.markdown)

  var prefixColor
  if (isBrowser()) {
    prefixColor = colors[lastUsedColorIndex % colors.length]
    lastUsedColorIndex += 1
  } else if (isNode()) {
    prefixColor = getNextPrefixColor()
  }

  return {
    prefix: prefix,
    alignOutput: alignOutput,
    markdown: markdown,
    prefixColor: prefixColor
  }
}

function alignPrefixes (instances) {
  var longest = instances.sort(function (a, b) {
    return b.opts.prefix.length - a.opts.prefix.length
  })[0]

  instances.forEach(function (instance) {
    if (instance.opts.alignOutput) {
      var padding = new Array(Math.max(longest.opts.prefix.length - instance.opts.prefix.length + 1, 0)).join(' ')
      instance.opts.prefix = instance.opts.prefix + padding
    }
  })
}

function updateEnabledDisabled () {
  if (isBrowser()) {
    if (
      window.localStorage &&
      typeof window.localStorage.getItem('debug') === 'string'
    ) {
      Logdown.disable('*')
      window.localStorage.debug
        .split(',')
        .forEach(function (regExp) {
          Logdown.enable(regExp)
        })
    }
  } else if (isNode()) {
    // Parsing `NODE_DEBUG` and `DEBUG` env var.
    var envVar = null
    if (
      typeof process !== 'undefined' &&
      process.env !== undefined
    ) {
      // `NODE_DEBUG` has precedence over `DEBUG`
      if (
        process.env.NODE_DEBUG !== undefined &&
        process.env.NODE_DEBUG !== ''
      ) {
        envVar = 'NODE_DEBUG'
      } else if (
        process.env.DEBUG !== undefined &&
        process.env.DEBUG !== ''
      ) {
        envVar = 'DEBUG'
      }

      if (envVar) {
        Logdown.disable('*')
        process.env[envVar]
          .split(',')
          .forEach(function (regExp) {
            Logdown.enable(regExp)
          })
      }
    }
  }
}

function parseMarkdown (text) {
  var styles = []
  var match = getNextMatch(text)

  while (match) {
    text = text.replace(match.rule.regexp, match.rule.replacer)

    if (isBrowser()) {
      styles.push(match.rule.style)
      styles.push('') // Empty string resets style.
    }

    match = getNextMatch(text)
  }

  return {text: text, styles: styles}
}

function getNextMatch (text) {
  var matches = []
  var rules = []
  if (isBrowser()) {
    rules = [
      {
        regexp: /\*([^*]+)\*/,
        replacer: function (match, submatch1) {
          return '%c' + submatch1 + '%c'
        },
        style: 'font-weight:bold;'
      },
      {
        regexp: /_([^_]+)_/,
        replacer: function (match, submatch1) {
          return '%c' + submatch1 + '%c'
        },
        style: 'font-style:italic;'
      },
      {
        regexp: /`([^`]+)`/,
        replacer: function (match, submatch1) {
          return '%c' + submatch1 + '%c'
        },
        style:
          'background:#FDF6E3; ' +
          'color:#586E75; ' +
          'padding:1px 5px; ' +
          'border-radius:4px;'
      }
    ]
  } else if (isNode()) {
    rules = [
      {
        regexp: /\*([^*]+)\*/,
        replacer: function (match, submatch1) {
          return '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
                 submatch1 +
                 '\u001b[' + ansiColors.modifiers.bold[1] + 'm'
        }
      },
      {
        regexp: /_([^_]+)_/,
        replacer: function (match, submatch1) {
          return '\u001b[' + ansiColors.modifiers.italic[0] + 'm' +
                 submatch1 +
                 '\u001b[' + ansiColors.modifiers.italic[1] + 'm'
        }
      },
      {
        regexp: /`([^`]+)`/,
        replacer: function (match, submatch1) {
          return '\u001b[' + ansiColors.bgColors.bgYellow[0] + 'm' +
                 '\u001b[' + ansiColors.colors.black[0] + 'm' +
                 ' ' + submatch1 + ' ' +
                 '\u001b[' + ansiColors.colors.black[1] + 'm' +
                 '\u001b[' + ansiColors.bgColors.bgYellow[1] + 'm'
        }
      }
    ]
  }

  //
  rules.forEach(function (rule) {
    var match = text.match(rule.regexp)
    if (match) {
      matches.push({
        rule: rule,
        match: match
      })
    }
  })
  if (matches.length === 0) {
    return null
  }

  //
  matches.sort(function (a, b) {
    return a.match.index - b.match.index
  })

  return matches[0]
}

function prepareOutputToBrowser (args, instance) {
  var preparedOutput = []
  var parsedMarkdown

  if (instance.opts.prefix) {
    if (isColorSupported()) {
      preparedOutput.push('%c' + instance.opts.prefix + '%c ')
      preparedOutput.push(
        'color:' + instance.opts.prefixColor + '; font-weight:bold;',
        '' // Empty string resets style.
      )
    } else {
      preparedOutput.push('[' + instance.prefix + '] ')
    }
  } else {
    preparedOutput.push('')
  }

  // Only first argument on `console` can have style.
  if (typeof args[0] === 'string') {
    if (instance.opts.markdown && isColorSupported()) {
      parsedMarkdown = parseMarkdown(args[0])
      preparedOutput[0] = preparedOutput[0] + parsedMarkdown.text
      preparedOutput = preparedOutput.concat(parsedMarkdown.styles)
    } else {
      preparedOutput[0] = preparedOutput[0] + args[0]
    }
  } else {
    preparedOutput[0] = args[0]
  }

  if (args.length > 1) {
    preparedOutput = preparedOutput.concat(args.splice(1))
  }

  return preparedOutput
}

function prepareOutputToNode (args, method, instance) {
  var preparedOutput = []

  if (instance.opts.prefix) {
    if (isColorSupported()) {
      preparedOutput[0] =
        '\u001b[' + instance.opts.prefixColor[0] + 'm' +
        '\u001b[' + ansiColors.modifiers.bold[0] + 'm' +
        instance.opts.prefix +
        '\u001b[' + ansiColors.modifiers.bold[1] + 'm' +
        '\u001b[' + instance.opts.prefixColor[1] + 'm'
    } else {
      preparedOutput[0] = '[' + instance.opts.prefix + ']'
    }
  }

  if (method === 'warn') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.yellow[0] + 'm' +
      '⚠' +
      '\u001b[' + ansiColors.colors.yellow[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'error') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.red[0] + 'm' +
      '✖' +
      '\u001b[' + ansiColors.colors.red[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'info') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.blue[0] + 'm' +
      'ℹ' +
      '\u001b[' + ansiColors.colors.blue[1] + 'm ' +
      (preparedOutput[0] || '')
  } else if (method === 'debug') {
    preparedOutput[0] =
      '\u001b[' + ansiColors.colors.gray[0] + 'm' +
      '🐛' +
      '\u001b[' + ansiColors.colors.gray[1] + 'm ' +
      (preparedOutput[0] || '')
  }

  args.forEach(function (arg) {
    if (typeof arg === 'string') {
      if (instance.opts.markdown) {
        preparedOutput.push(parseMarkdown(arg).text)
      } else {
        preparedOutput.push(arg)
      }
    } else {
      preparedOutput.push(arg)
    }
  })

  return preparedOutput
}

function isDisabled (instance) {
  var isDisabled_ = false
  filterRegExps.forEach(function (filter) {
    if (
      filter.type === 'enable' &&
      filter.regExp.test(instance.opts.prefix)
    ) {
      isDisabled_ = false
    } else if (
      filter.type === 'disable' &&
      filter.regExp.test(instance.opts.prefix)
    ) {
      isDisabled_ = true
    }
  })

  return isDisabled_
}

function prepareRegExpForPrefixSearch (str) {
  return new RegExp('^' + str.replace(/\*/g, '.*?') + '$')
}

function isPrefixAlreadyInUse (prefix, instances) {
  var isPrefixAlreadyInUse_ = false

  instances.forEach(function (instance) {
    if (instance.opts.prefix === prefix) {
      isPrefixAlreadyInUse_ = true
      return
    }
  })
  return isPrefixAlreadyInUse_
}

function getInstanceByPrefix (prefix, instances) {
  var instance

  instances.forEach(function (instanceCur) {
    if (instanceCur.opts.prefix === prefix) {
      instance = instanceCur
      return
    }
  })

  return instance
}

function sanitizeStringToBrowser (str) {
  if (typeof str === 'string') {
    return str.replace(/%c/g, '')
  } else {
    return str
  }
}

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * Code took from https://github.com/visionmedia/debug/blob/master/browser.js
 */
function isColorSupported () {
  if (isBrowser()) {
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    var isWebkit = ('WebkitAppearance' in document.documentElement.style)
    // Is firebug? http://stackoverflow.com/a/398120/376773
    var isFirebug = (
      window.console &&
      (console.firebug || (console.exception && console.table))
    )
    // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/
    //  Web_Console#Styling_messages
    var isFirefox31Plus = (
      navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
      parseInt(RegExp.$1, 10) >= 31
    )

    return (isWebkit || isFirebug || isFirefox31Plus)
  } else if (isNode()) {
    if (process.stdout && !process.stdout.isTTY) {
      return false
    }

    if (process.platform === 'win32') {
      return true
    }

    if ('COLORTERM' in process.env) {
      return true
    }

    if (process.env.TERM === 'dumb') {
      return false
    }

    if (
      /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)
    ) {
      return true
    }

    return false
  }
}

function isNode () {
  return (
    typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined'
  )
}

function isBrowser () {
  return (typeof window !== 'undefined')
}

var getNextPrefixColor = (function () {
  var lastUsed = 0
  var nodePrefixColors = [
    [31, 39], // red
    [32, 39], // green
    [33, 39], // yellow
    [34, 39], // blue
    [35, 39], // magenta
    [36, 39] // cyan
  ]

  return function () {
    lastUsed += 1
    return nodePrefixColors[lastUsed % nodePrefixColors.length]
  }
})()

module.exports = Logdown

}).call(this,require('_process'))
},{"_process":1}]},{},[2])(2)
});