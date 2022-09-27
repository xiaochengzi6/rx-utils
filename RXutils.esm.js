function log(value) {
  console.log(value);
}

// 创建版本
var VERSION = '1.0.0';

/**
 * self 浏览器环境和 web Worker，当self.window = self 等同于 window.window = window
 * 支持 global node 环境
 * 在沙箱中没有 window 也没有 global 所以使用 this
 * 小程序中没有 window 也没有 global 会启用严格模式 禁止使用 this 作为全局对象 所以是 {}
 */
var root =
  (typeof self === 'object' && self.window === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  undefined ||
  {};

// 持有其原型
var ArrayProto = Array.prototype, ObjectProto = Array.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// 使用原始的 array 方法
var push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjectProto.toString,
  hasOwnProperty = ObjectProto.hasOwnProperty;

// 如果能使用 es5 原生语法尽量使用
var nativeKeys = Object.keys,
  nativeIsArray = Array.isArray,
  nativeCreate = Object.create;


// 最大值
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLink(obj){
  var length = obj.length;
  if(obj && typeof length === 'number' && length >= 0 && length < MAX_ARRAY_INDEX){
    return true
  }
  return false
}

function optimizeCb(func, context, argCount){
  if(context === void 0) return func 
  
  // 使用 call 的性能比使用 apply 的要好
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function(value){
        return func.call(context, value)
      }
    case 2:
      return function(value, index){
        return func.call(context, value, index)
      }
    case 3:
      return function (value, index, args){
        return func.call(context, value, index, args)
      }
    // 例如 redux
    case 4:
      return function (preValue, value, index, args){
        return func.call(context, preValue, value, index, args)
      } 
  }
  
  
  // 剩余情况
  return function (){
    return func.apply(context, arguments)
  }
}

function isObject(obj){
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj)
}

// 处理 key 是否是 obj 的属性
function has(obj, key){
  return obj != null && hasOwnProperty.call(obj, key)
}

function keys(obj){
  if (!isObject(obj)) return []
  if (nativeKeys) return nativeKeys(obj)
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);

  return keys
}

function each(obj, callback, context){
  var iteratee = optimizeCb(callback, context);
  var i, length;

  if(isArrayLink(obj)){
    for(i = 0, length = obj.length; i < length; i++){
      iteratee(obj[i], i, obj);
    }
  }else {
    var _keys = keys(obj);
    for(i = 0, length = _keys.length; i < length; i++){
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }

  return obj
}

function tagTester(name){
  var tag = '[object ' + name + ']';

  return function(obj){
    return toString.call(obj) === tag
  }
}

var isFunction = tagTester('Function');

// 遍历找出对象上所有的函数
function functions (obj) {
  var names = [];

  for(var key in obj){
    if(isFunction(obj[key])){
      names.push(key);
    }
  }
  
  return names.sort()
}

function _$1() {
  var _ = function (obj) {
    if (obj instanceof _) return obj
    if (!(this instanceof _)) return new _(obj)
    this._wrapped = obj;
  };
}

_$1.version = VERSION;

// 返回最终结果
_$1.prototype.value = function () {
  return this._wrapped
};

/**
 * 这里默认不开启链式调用
 * 
 * 将函数返回的对象 {_wrapped: Value} 处理成被 _ 包裹后的对象在返回
 * 
 * @param {*} instance {_wrapped: Value}
 * @param {*} obj 当前对象
 * @returns 
 */
function chainResult(instance, obj){
  return instance._chain ? _$1(obj).chain() : obj
}

/**
 * 将对象的所有方法混合到 _ 对象的原型上
 * @param {*} obj 
 */
function mixin(obj){
  each(functions(obj), function (name){
    var func = _$1[name] = obj[name];
    _$1.prototype[name] = function(){
      var args = [this._wrapped];
      push.apply(args, arguments);
      
      return chainResult(this, func.call(_$1, args))
    };
  });

  return _$1
}

var allExports = {
  __proto__: null,
  log: log,
  each: each,
  isObject: isObject,
  isFunction: isFunction,
  functions: functions,
  keys: keys,
  mixin: mixin,
  tagTester: tagTester
};

var _ = mixin(allExports);

_._ = _;

export { _ as default, each, functions, isFunction, isObject, keys, log, mixin, tagTester };
//# sourceMappingURL=RXutils.esm.js.map
