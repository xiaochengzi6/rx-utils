// 创建版本
export var VERSION = '1.0.0'

/**
 * self 浏览器环境和 web Worker，当self.window = self 等同于 window.window = window
 * 支持 global node 环境
 * 在沙箱中没有 window 也没有 global 所以使用 this
 * 小程序中没有 window 也没有 global 会启用严格模式 禁止使用 this 作为全局对象 所以是 {}
 */
export var root =
  (typeof self === 'object' && self.window === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this ||
  {}

// 持有其原型
export var ArrayProto = Array.prototype, ObjectProto = Array.prototype
export var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null

// 使用原始的 array 方法
export var push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjectProto.toString,
  hasOwnProperty = ObjectProto.hasOwnProperty

// 如果能使用 es5 原生语法尽量使用
export var nativeKeys = Object.keys,
  nativeIsArray = Array.isArray,
  nativeCreate = Object.create


// 最大值
export var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1