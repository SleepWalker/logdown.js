/**
 * logdown - Debug utility with markdown support that runs on browser and server
 *
 * @version v1.1.0
 * @link https://github.com/caiogondim/logdown
 * @author Caio Gondim <me@caiogondim.com> (http://caiogondim.com)
 * @license ISC
 */
!function(){"use strict";function e(r){if(!(this instanceof e))return new e(r);r=r||{};var o=void 0===r.prefix?"":r.prefix;return o=a(o),o&&s(o,x)?c(o,x):(this.markdown=void 0===r.markdown?!0:r.markdown,this.prefix=o,x.push(this),f()?(this.prefixColor=m[g%m.length],g+=1):u()&&(this.prefixColor=v()),this)}function r(e){for(var r=[],t=o(e);t;)e=e.replace(t.rule.regexp,t.rule.replacer),f()&&(r.push(t.rule.style),r.push("color:inherit;")),t=o(e);return{text:e,styles:r}}function o(e){var r=[],o=[];return f()?o=[{regexp:/\*([^\*]+)\*/,replacer:function(e,r){return"%c"+r+"%c"},style:"font-weight:bold;"},{regexp:/\_([^\_]+)\_/,replacer:function(e,r){return"%c"+r+"%c"},style:"font-style:italic;"},{regexp:/\`([^\`]+)\`/,replacer:function(e,r){return"%c"+r+"%c"},style:"background:#FDF6E3; color:#586E75; padding:1px 5px; border-radius:4px;"}]:u()&&(o=[{regexp:/\*([^\*]+)\*/,replacer:function(e,r){return"["+b.modifiers.bold[0]+"m"+r+"["+b.modifiers.bold[1]+"m"}},{regexp:/\_([^\_]+)\_/,replacer:function(e,r){return"["+b.modifiers.italic[0]+"m"+r+"["+b.modifiers.italic[1]+"m"}},{regexp:/\`([^\`]+)\`/,replacer:function(e,r){return"["+b.bgColors.bgYellow[0]+"m["+b.colors.black[0]+"m "+r+" ["+b.colors.black[1]+"m["+b.bgColors.bgYellow[1]+"m"}}]),o.forEach(function(o){var t=e.match(o.regexp);t&&r.push({rule:o,match:t})}),0===r.length?null:(r.sort(function(e,r){return e.match.index-r.match.index}),r[0])}function t(e,o){var t,n,i,l;return"string"==typeof e?o.markdown&&p()?(t=r(e),n=t.text,i=t.styles):(n=e,i=[]):(n=n||"",i=i||[],l=e),o.prefix&&(p()?(n="%c"+o.prefix+"%c "+n,i.unshift("color:"+o.prefixColor+"; font-weight:bold;","color:inherit;")):n="["+o.prefix+"] "+n),{parsedText:n,styles:i,notText:l}}function n(e,o){var t,n="";return o.prefix&&(n=p()?"["+o.prefixColor[0]+"m["+b.modifiers.bold[0]+"m"+o.prefix+"["+b.modifiers.bold[1]+"m["+o.prefixColor[1]+"m ":"["+o.prefix+"] "),"string"==typeof e?n+=o.markdown?r(e).text:e:t=e,{parsedText:n,styles:[],notText:t}}function i(e){var r=!1;return h.forEach(function(o){"enable"===o.type&&o.regExp.test(e.prefix)?r=!1:"disable"===o.type&&o.regExp.test(e.prefix)&&(r=!0)}),r}function l(e){return new RegExp("^"+e.replace(/\*/g,".*?")+"$")}function s(e,r){var o=!1;return r.forEach(function(r){return r.prefix===e?void(o=!0):void 0}),o}function c(e,r){var o;return r.forEach(function(r){return r.prefix===e?void(o=r):void 0}),o}function a(e){return"string"==typeof e?e.replace(/\%c/g,""):e}function p(){if(f()){var e="WebkitAppearance"in document.documentElement.style,r=window.console&&(console.firebug||console.exception&&console.table),o=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31;return e||r||o}return u()?process.stdout&&!process.stdout.isTTY?!1:"win32"===process.platform?!0:"COLORTERM"in process.env?!0:"dumb"===process.env.TERM?!1:/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)?!0:!1:void 0}function u(){return"undefined"!=typeof module&&"undefined"!=typeof module.exports}function f(){return"undefined"!=typeof window}function d(e){return e}var x=[],g=0,m=["#B58900","#CB4B16","#DC322F","#D33682","#6C71C4","#268BD2","#2AA198","#859900"],b={modifiers:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},colors:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39]},bgColors:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49]}},h=[];e.enable=function(){Array.prototype.forEach.call(arguments,function(r){"-"===r[0]&&e.disable(r.substr(1));var o=l(r);"*"===r?h=[{type:"enable",regExp:o}]:h.push({type:"enable",regExp:o})})},e.disable=function(){Array.prototype.forEach.call(arguments,function(r){"-"===r[0]&&e.enable(r.substr(1));var o=l(r);"*"===r?h=[{type:"disable",regExp:o}]:h.push({type:"disable",regExp:o})})};var y=["log","info","warn","error"];y.forEach(function(r){e.prototype[r]=function(){var e,o=[];if(!i(this)){var l=Array.prototype.slice.call(arguments,0).join(" ");f()?(l=a(l),e=t(l,this),Function.prototype.apply.call(console[r],console,[e.parsedText].concat(e.styles,[e.notText]))):u()&&(l=d(l),e=n(l,this),"warn"===r?e.parsedText="["+b.colors.yellow[0]+"m⚠["+b.colors.yellow[1]+"m "+e.parsedText:"error"===r?e.parsedText="["+b.colors.red[0]+"m✖["+b.colors.red[1]+"m "+e.parsedText:"info"===r&&(e.parsedText="["+b.colors.blue[0]+"mℹ["+b.colors.blue[1]+"m "+e.parsedText),o.push(e.parsedText),e.notText&&o.push(e.notText),console[r].apply(console,o))}}});var v=function(){var e=0,r=[[31,39],[32,39],[33,39],[34,39],[35,39],[36,39]];return function(){return r[(e+=1)%r.length]}}();u()?module.exports=e:f()&&(window.Logdown=e)}();