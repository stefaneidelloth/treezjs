(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
  (global = global || self, factory(global['rmiz-umd'] = {}, global.React, global.ReactDOM));
}(this, (function (exports, React, reactDom) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  // focus - focusOptions - preventScroll polyfill
  (function() {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      typeof HTMLElement === "undefined"
    ) {
      return;
    }

    var supportsPreventScrollOption = false;
    try {
      var focusElem = document.createElement("div");
      focusElem.addEventListener(
        "focus",
        function(event) {
          event.preventDefault();
          event.stopPropagation();
        },
        true
      );
      focusElem.focus(
        Object.defineProperty({}, "preventScroll", {
          get: function() {
            supportsPreventScrollOption = true;
          }
        })
      );
    } catch (e) {}

    if (
      HTMLElement.prototype.nativeFocus === undefined &&
      !supportsPreventScrollOption
    ) {
      HTMLElement.prototype.nativeFocus = HTMLElement.prototype.focus;

      var patchedFocus = function(args) {
        var actualPosition = window.scrollY || window.pageYOffset;
        this.nativeFocus();
        if (args && args.preventScroll) {
          // Hijacking the event loop order, since the focus() will trigger
          // internally an scroll that goes to the event loop
          setTimeout(function() {
            window.scroll(window.scrollX || window.pageXOffset, actualPosition);
          }, 0);
        }
      };

      HTMLElement.prototype.focus = patchedFocus;
    }
  })();

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var util = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.isNavigator = exports.isBrowser = exports.off = exports.on = exports.noop = void 0;
  var noop = function () { };
  exports.noop = noop;
  function on(obj) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      if (obj && obj.addEventListener) {
          obj.addEventListener.apply(obj, args);
      }
  }
  exports.on = on;
  function off(obj) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
      }
      if (obj && obj.removeEventListener) {
          obj.removeEventListener.apply(obj, args);
      }
  }
  exports.off = off;
  exports.isBrowser = typeof window !== 'undefined';
  exports.isNavigator = typeof navigator !== 'undefined';
  });

  unwrapExports(util);
  var util_1 = util.isNavigator;
  var util_2 = util.isBrowser;
  var util_3 = util.off;
  var util_4 = util.on;
  var util_5 = util.noop;

  var useEvent_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var defaultTarget = util.isBrowser ? window : null;
  var isListenerType1 = function (target) {
      return !!target.addEventListener;
  };
  var isListenerType2 = function (target) {
      return !!target.on;
  };
  var useEvent = function (name, handler, target, options) {
      if (target === void 0) { target = defaultTarget; }
      React__default.useEffect(function () {
          if (!handler) {
              return;
          }
          if (!target) {
              return;
          }
          if (isListenerType1(target)) {
              util.on(target, name, handler, options);
          }
          else if (isListenerType2(target)) {
              target.on(name, handler, options);
          }
          return function () {
              if (isListenerType1(target)) {
                  util.off(target, name, handler, options);
              }
              else if (isListenerType2(target)) {
                  target.off(name, handler, options);
              }
          };
      }, [name, handler, target, JSON.stringify(options)]);
  };
  exports.default = useEvent;
  });

  var useEvent = unwrapExports(useEvent_1);

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __param(paramIndex, decorator) {
      return function (target, key) { decorator(target, key, paramIndex); }
  }

  function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }

  var __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
  }) : (function(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
  });

  function __exportStar(m, o) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
  }

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  /** @deprecated */
  function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read(arguments[i]));
      return ar;
  }

  /** @deprecated */
  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  function __spreadArray(to, from) {
      for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
          to[j] = from[i];
      return to;
  }

  function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
  }

  function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
      function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
  }

  function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
      function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
  }

  function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  }

  function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
      return cooked;
  }
  var __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
      o["default"] = v;
  };

  function __importStar(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      __setModuleDefault(result, mod);
      return result;
  }

  function __importDefault(mod) {
      return (mod && mod.__esModule) ? mod : { default: mod };
  }

  function __classPrivateFieldGet(receiver, privateMap) {
      if (!privateMap.has(receiver)) {
          throw new TypeError("attempted to get private field on non-instance");
      }
      return privateMap.get(receiver);
  }

  function __classPrivateFieldSet(receiver, privateMap, value) {
      if (!privateMap.has(receiver)) {
          throw new TypeError("attempted to set private field on non-instance");
      }
      privateMap.set(receiver, value);
      return value;
  }

  var tslib_es6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    __extends: __extends,
    get __assign () { return __assign; },
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __spreadArray: __spreadArray,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet
  });

  var useEffectOnce_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var useEffectOnce = function (effect) {
      React__default.useEffect(effect, []);
  };
  exports.default = useEffectOnce;
  });

  unwrapExports(useEffectOnce_1);

  var useUnmount_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var useEffectOnce_1$1 = tslib_es6.__importDefault(useEffectOnce_1);
  var useUnmount = function (fn) {
      var fnRef = React__default.useRef(fn);
      // update the ref each render so if it change the newest callback will be invoked
      fnRef.current = fn;
      useEffectOnce_1$1.default(function () { return function () { return fnRef.current(); }; });
  };
  exports.default = useUnmount;
  });

  unwrapExports(useUnmount_1);

  var useRafState_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var useUnmount_1$1 = tslib_es6.__importDefault(useUnmount_1);
  var useRafState = function (initialState) {
      var frame = React__default.useRef(0);
      var _a = React__default.useState(initialState), state = _a[0], setState = _a[1];
      var setRafState = React__default.useCallback(function (value) {
          cancelAnimationFrame(frame.current);
          frame.current = requestAnimationFrame(function () {
              setState(value);
          });
      }, []);
      useUnmount_1$1.default(function () {
          cancelAnimationFrame(frame.current);
      });
      return [state, setRafState];
  };
  exports.default = useRafState;
  });

  unwrapExports(useRafState_1);

  var useWindowSize_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var useRafState_1$1 = tslib_es6.__importDefault(useRafState_1);

  var useWindowSize = function (initialWidth, initialHeight) {
      if (initialWidth === void 0) { initialWidth = Infinity; }
      if (initialHeight === void 0) { initialHeight = Infinity; }
      var _a = useRafState_1$1.default({
          width: util.isBrowser ? window.innerWidth : initialWidth,
          height: util.isBrowser ? window.innerHeight : initialHeight,
      }), state = _a[0], setState = _a[1];
      React__default.useEffect(function () {
          if (util.isBrowser) {
              var handler_1 = function () {
                  setState({
                      width: window.innerWidth,
                      height: window.innerHeight,
                  });
              };
              util.on(window, 'resize', handler_1);
              return function () {
                  util.off(window, 'resize', handler_1);
              };
          }
      }, []);
      return state;
  };
  exports.default = useWindowSize;
  });

  var useWindowSize = unwrapExports(useWindowSize_1);

  var toDurationString = function (duration) { return duration + "ms"; };
  var getScale = function (_a) {
      var height = _a.height, innerHeight = _a.innerHeight, innerWidth = _a.innerWidth, width = _a.width, zoomMargin = _a.zoomMargin;
      var scaleX = innerWidth / (width + zoomMargin);
      var scaleY = innerHeight / (height + zoomMargin);
      var scale = Math.min(scaleX, scaleY);
      return scale;
  };
  var getModalContentStyle = function (_a) {
      var height = _a.height, innerHeight = _a.innerHeight, innerWidth = _a.innerWidth, isLoaded = _a.isLoaded, isUnloading = _a.isUnloading, left = _a.left, originalTransform = _a.originalTransform, top = _a.top, transitionDuration = _a.transitionDuration, width = _a.width, zoomMargin = _a.zoomMargin;
      var transitionDurationString = toDurationString(transitionDuration);
      if (!isLoaded || isUnloading) {
          var initTransform = __spreadArrays([
              "scale(1)",
              "translate(0, 0)"
          ], (originalTransform ? [originalTransform] : [])).join(' ');
          return {
              height: height,
              left: left,
              top: top,
              transform: initTransform,
              WebkitTransform: initTransform,
              transitionDuration: transitionDurationString,
              width: width
          };
      }
      // Get amount to scale item
      var scale = getScale({
          height: height,
          innerWidth: innerWidth,
          innerHeight: innerHeight,
          width: width,
          zoomMargin: zoomMargin
      });
      // Get the the coords for center of the viewport
      var viewportX = innerWidth / 2;
      var viewportY = innerHeight / 2;
      // Get the coords for center of the parent item
      var childCenterX = left + width / 2;
      var childCenterY = top + height / 2;
      // Get offset amounts for item coords to be centered on screen
      var translateX = (viewportX - childCenterX) / scale;
      var translateY = (viewportY - childCenterY) / scale;
      // Build transform style, including any original transform
      var transform = __spreadArrays([
          "scale(" + scale + ")",
          "translate(" + translateX + "px, " + translateY + "px)"
      ], (originalTransform ? [originalTransform] : [])).join(' ');
      return {
          height: height,
          left: left,
          top: top,
          transform: transform,
          WebkitTransform: transform,
          transitionDuration: transitionDurationString,
          width: width
      };
  };
  var getModalOverlayStyle = function (_a) {
      var isLoaded = _a.isLoaded, isUnloading = _a.isUnloading, overlayBgColorEnd = _a.overlayBgColorEnd, overlayBgColorStart = _a.overlayBgColorStart, transitionDuration = _a.transitionDuration, zoomZindex = _a.zoomZindex;
      var style = {
          backgroundColor: overlayBgColorStart,
          transitionDuration: toDurationString(transitionDuration),
          zIndex: zoomZindex
      };
      if (isLoaded && !isUnloading) {
          style.backgroundColor = overlayBgColorEnd;
      }
      return style;
  };
  var pseudoParentEl = {
      getBoundingClientRect: function () { return ({
          height: 0,
          left: 0,
          top: 0,
          width: 0
      }); },
      style: {
          transform: null
      }
  };

  var UncontrolledActivated = function (_a) {
      var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom Image' : _b, onUnload = _a.onUnload, onLoad = _a.onLoad, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, parentRef = _a.parentRef, _e = _a.portalEl, portalEl = _e === void 0 ? document.body : _e, _f = _a.scrollableEl, scrollableEl = _f === void 0 ? window : _f, _g = _a.transitionDuration, transitionDuration = _g === void 0 ? 300 : _g, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
      var btnRef = React.useRef(null);
      var _k = React.useState(0), forceUpdate = _k[1];
      var _l = React.useState(false), isLoaded = _l[0], setIsLoaded = _l[1];
      var _m = React.useState(false), isUnloading = _m[0], setIsUnloading = _m[1];
      var _o = useWindowSize(), innerWidth = _o.width, innerHeight = _o.height;
      // on click, begin unloading
      var handleClick = React.useCallback(function (e) {
          e.preventDefault();
          setIsUnloading(true);
      }, []);
      // on escape, begin unloading
      var handleKeyDown = React.useCallback(function (e) {
          if (e.key === 'Escape' || e.keyCode === 27) {
              e.stopPropagation();
              setIsUnloading(true);
          }
      }, []);
      var handleScroll = React.useCallback(function () {
          forceUpdate(function (n) { return n + 1; });
          if (!isUnloading) {
              setIsUnloading(true);
          }
      }, [isUnloading]);
      // listen for keydown on the document
      useEvent('keydown', handleKeyDown, document);
      // listen for scroll and close
      useEvent('scroll', handleScroll, scrollableEl);
      // set loaded on mount and focus
      React.useEffect(function () {
          setIsLoaded(true);
          onLoad();
          if (btnRef.current) {
              btnRef.current.focus({ preventScroll: true });
          }
      }, [onLoad]);
      // if unloading, tell parent that we're all done here after Nms
      React.useEffect(function () {
          var unloadTimeout = isUnloading
              ? setTimeout(onUnload, transitionDuration)
              : null;
          return function () {
              if (unloadTimeout) {
                  clearTimeout(unloadTimeout);
              }
          };
      }, [isUnloading, onUnload, transitionDuration]);
      // use parent element or fake one if it's not yet loaded
      var parentEl = parentRef.current || pseudoParentEl;
      // get parent item's dimensions
      var _p = parentEl.getBoundingClientRect(), height = _p.height, left = _p.left, top = _p.top, width = _p.width;
      var overlayStyle = getModalOverlayStyle({
          isLoaded: isLoaded,
          isUnloading: isUnloading,
          overlayBgColorEnd: overlayBgColorEnd,
          overlayBgColorStart: overlayBgColorStart,
          transitionDuration: transitionDuration,
          zoomZindex: zoomZindex
      });
      var contentStyle = getModalContentStyle({
          height: height,
          isLoaded: isLoaded,
          innerHeight: innerHeight,
          innerWidth: innerWidth,
          isUnloading: isUnloading,
          left: left,
          originalTransform: parentEl.style.transform,
          top: top,
          transitionDuration: transitionDuration,
          width: width,
          zoomMargin: zoomMargin
      });
      return reactDom.createPortal(React__default.createElement("div", { "aria-modal": true, "data-rmiz-overlay": true, role: "dialog", style: overlayStyle },
          React__default.createElement("div", { "data-rmiz-modal-content": true, style: contentStyle }, children),
          React__default.createElement("button", { "aria-label": closeText, "data-rmiz-btn-close": true, onClick: handleClick, ref: btnRef })), portalEl);
  };
  var UncontrolledActivated$1 = React.memo(UncontrolledActivated);

  var Uncontrolled = function (_a) {
      var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom image' : _b, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, portalEl = _a.portalEl, _e = _a.openText, openText = _e === void 0 ? 'Zoom image' : _e, scrollableEl = _a.scrollableEl, _f = _a.transitionDuration, transitionDuration = _f === void 0 ? 300 : _f, _g = _a.wrapElement, WrapElement = _g === void 0 ? 'div' : _g, wrapStyle = _a.wrapStyle, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
      var _k = React.useState(false), isActive = _k[0], setIsActive = _k[1];
      var _l = React.useState(false), isChildLoaded = _l[0], setIsChildLoaded = _l[1];
      var wrapRef = React.useRef(null);
      var btnRef = React.useRef(null);
      var handleClickTrigger = React.useCallback(function (e) {
          if (!isActive) {
              e.preventDefault();
              setIsActive(true);
          }
      }, [isActive]);
      var handleChildLoad = React.useCallback(function () {
          setIsChildLoaded(true);
      }, []);
      var handleChildUnload = React.useCallback(function () {
          setIsActive(false);
          setIsChildLoaded(false);
          if (btnRef.current) {
              btnRef.current.focus({ preventScroll: true });
          }
      }, []);
      var isExpanded = isActive && isChildLoaded;
      var wrapType = isExpanded ? 'hidden' : 'visible';
      return (React__default.createElement(React.StrictMode, null,
          React__default.createElement(WrapElement, { "data-rmiz-wrap": wrapType, ref: wrapRef, style: wrapStyle },
              children,
              React__default.createElement("button", { "aria-label": openText, "data-rmiz-btn-open": true, onClick: handleClickTrigger, ref: btnRef }),
              typeof window !== 'undefined' && isActive && (React__default.createElement(UncontrolledActivated$1, { closeText: closeText, onLoad: handleChildLoad, onUnload: handleChildUnload, overlayBgColorEnd: overlayBgColorEnd, overlayBgColorStart: overlayBgColorStart, parentRef: wrapRef, portalEl: portalEl, scrollableEl: scrollableEl, transitionDuration: transitionDuration, zoomMargin: zoomMargin, zoomZindex: zoomZindex }, children)))));
  };
  var Uncontrolled$1 = React.memo(Uncontrolled);

  var usePrevious_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  function usePrevious(state) {
      var ref = React__default.useRef();
      React__default.useEffect(function () {
          ref.current = state;
      });
      return ref.current;
  }
  exports.default = usePrevious;
  });

  var usePrevious = unwrapExports(usePrevious_1);

  var ControlledActivated = function (_a) {
      var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom Image' : _b, isActiveFromParent = _a.isActive, onLoad = _a.onLoad, onUnload = _a.onUnload, onZoomChange = _a.onZoomChange, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, parentRef = _a.parentRef, _e = _a.portalEl, portalEl = _e === void 0 ? document.body : _e, _f = _a.scrollableEl, scrollableEl = _f === void 0 ? window : _f, _g = _a.transitionDuration, transitionDuration = _g === void 0 ? 300 : _g, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
      var btnRef = React.useRef(null);
      var _k = React.useState(0), forceUpdate = _k[1];
      var _l = React.useState(isActiveFromParent), isActive = _l[0], setIsActive = _l[1];
      var _m = React.useState(false), isLoaded = _m[0], setIsLoaded = _m[1];
      var _o = React.useState(false), isUnloading = _o[0], setIsUnloading = _o[1];
      var prevIsActive = usePrevious(isActive);
      var prevIsActiveFromParent = usePrevious(isActiveFromParent);
      var prevIsLoaded = usePrevious(isLoaded);
      var _p = useWindowSize(), innerWidth = _p.width, innerHeight = _p.height;
      // on click, tell caller it should zoom
      var handleClick = React.useCallback(function (e) {
          e.preventDefault();
          if (onZoomChange) {
              onZoomChange(false);
          }
      }, [onZoomChange]);
      // on escape, tell caller it should unzoom
      var handleKeyDown = React.useCallback(function (e) {
          if (isActive && (e.key === 'Escape' || e.keyCode === 27)) {
              e.stopPropagation();
              if (onZoomChange) {
                  onZoomChange(false);
              }
          }
      }, [isActive, onZoomChange]);
      var handleScroll = React.useCallback(function () {
          forceUpdate(function (n) { return n + 1; });
          if (!isUnloading && onZoomChange) {
              onZoomChange(false);
          }
      }, [isUnloading, onZoomChange]);
      // listen for keydown on the document
      useEvent('keydown', handleKeyDown, document);
      // listen for scroll and close
      useEvent('scroll', handleScroll, scrollableEl);
      // set loaded on mount and focus
      React.useEffect(function () {
          if (!prevIsActive && isActive) {
              setIsLoaded(true);
              if (btnRef.current) {
                  btnRef.current.focus({ preventScroll: true });
              }
          }
      }, [isActive, prevIsActive]);
      React.useEffect(function () {
          // when parent says to deactivate, begin unloading process
          if (prevIsActiveFromParent && !isActiveFromParent) {
              setIsUnloading(true);
          }
          // when parent says to activate, begin active process
          if (!prevIsActiveFromParent && isActiveFromParent) {
              setIsActive(true);
          }
      }, [isActiveFromParent, prevIsActiveFromParent]);
      // if unloading, tell parent that we're all done here after Nms
      React.useEffect(function () {
          var unloadTimeout;
          if (isUnloading) {
              unloadTimeout = setTimeout(function () {
                  setIsLoaded(false);
                  setIsActive(false);
                  setIsUnloading(false);
              }, transitionDuration);
          }
          return function () {
              clearTimeout(unloadTimeout);
          };
      }, [isUnloading, transitionDuration]);
      // let parent know of changes to load status
      React.useEffect(function () {
          if (!prevIsLoaded && isLoaded) {
              onLoad();
          }
          if (prevIsLoaded && !isLoaded) {
              onUnload();
          }
      }, [isLoaded, onLoad, onUnload, prevIsLoaded]);
      // use parent element or fake one if it's not yet loaded
      var parentEl = parentRef.current || pseudoParentEl;
      // get parent element's dimensions
      var _q = parentEl.getBoundingClientRect(), height = _q.height, left = _q.left, top = _q.top, width = _q.width;
      var overlayStyle = getModalOverlayStyle({
          isLoaded: isLoaded,
          isUnloading: isUnloading,
          overlayBgColorEnd: overlayBgColorEnd,
          overlayBgColorStart: overlayBgColorStart,
          transitionDuration: transitionDuration,
          zoomZindex: zoomZindex
      });
      var contentStyle = getModalContentStyle({
          height: height,
          isLoaded: isLoaded,
          innerHeight: innerHeight,
          innerWidth: innerWidth,
          isUnloading: isUnloading,
          left: left,
          originalTransform: parentEl.style.transform,
          top: top,
          transitionDuration: transitionDuration,
          width: width,
          zoomMargin: zoomMargin
      });
      return isActive
          ? reactDom.createPortal(React__default.createElement("div", { "aria-modal": true, "data-rmiz-overlay": true, role: "dialog", style: overlayStyle },
              React__default.createElement("div", { "data-rmiz-modal-content": true, style: contentStyle }, children),
              React__default.createElement("button", { "aria-label": closeText, "data-rmiz-btn-close": true, onClick: handleClick, ref: btnRef, type: "button" })), portalEl)
          : null;
  };
  var ControlledActivated$1 = React.memo(ControlledActivated);

  var Controlled = function (_a) {
      var children = _a.children, _b = _a.closeText, closeText = _b === void 0 ? 'Unzoom image' : _b, isActive = _a.isZoomed, _c = _a.overlayBgColorEnd, overlayBgColorEnd = _c === void 0 ? 'rgba(255, 255, 255, 0.95)' : _c, _d = _a.overlayBgColorStart, overlayBgColorStart = _d === void 0 ? 'rgba(255, 255, 255, 0)' : _d, portalEl = _a.portalEl, onZoomChange = _a.onZoomChange, _e = _a.openText, openText = _e === void 0 ? 'Zoom image' : _e, scrollableEl = _a.scrollableEl, _f = _a.transitionDuration, transitionDuration = _f === void 0 ? 300 : _f, _g = _a.wrapElement, WrapElement = _g === void 0 ? 'div' : _g, wrapStyle = _a.wrapStyle, _h = _a.zoomMargin, zoomMargin = _h === void 0 ? 0 : _h, _j = _a.zoomZindex, zoomZindex = _j === void 0 ? 2147483647 : _j;
      var _k = React.useState(false), isChildLoaded = _k[0], setIsChildLoaded = _k[1];
      var wrapRef = React.useRef(null);
      var btnRef = React.useRef(null);
      var handleClickTrigger = React.useCallback(function (e) {
          if (!isActive && onZoomChange) {
              e.preventDefault();
              onZoomChange(true);
          }
      }, [isActive, onZoomChange]);
      var handleChildLoad = React.useCallback(function () {
          setIsChildLoaded(true);
      }, []);
      var handleChildUnload = React.useCallback(function () {
          setIsChildLoaded(false);
          if (btnRef.current) {
              btnRef.current.focus({ preventScroll: true });
          }
      }, []);
      var wrapType = isChildLoaded ? 'hidden' : 'visible';
      return (React__default.createElement(React.StrictMode, null,
          React__default.createElement(WrapElement, { "data-rmiz-wrap": wrapType, ref: wrapRef, style: wrapStyle },
              children,
              React__default.createElement("button", { "aria-label": openText, "data-rmiz-btn-open": true, onClick: handleClickTrigger, ref: btnRef, type: "button" }),
              typeof window !== 'undefined' && (React__default.createElement(ControlledActivated$1, { closeText: closeText, isActive: isActive, onLoad: handleChildLoad, onUnload: handleChildUnload, onZoomChange: onZoomChange, overlayBgColorEnd: overlayBgColorEnd, overlayBgColorStart: overlayBgColorStart, parentRef: wrapRef, portalEl: portalEl, scrollableEl: scrollableEl, transitionDuration: transitionDuration, zoomMargin: zoomMargin, zoomZindex: zoomZindex }, children)))));
  };
  var Controlled$1 = React.memo(Controlled);

  exports.Controlled = Controlled$1;
  exports.default = Uncontrolled$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
