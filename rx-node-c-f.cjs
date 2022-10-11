'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
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

function getType(target){
  var value = toString.call(target).slice(8, -1);
  return value 
}

/**
 * 判断是否是类数组
 * 
 * 具有 length 属性，且 length >= 0 且 length 小于最大值
 * @param {*} obj 
 * @returns 
 */
function isArrayLink(obj){
  var length = obj.length;
  if(obj && typeof length === 'number' && length >= 0 && length < MAX_ARRAY_INDEX){
    return true
  }
  return false
}

/**
 * 回调函数在使用 call || apply 时候的优化 
 * @param {*} func 回调函数
 * @param {*} context? 上下文 可选 
 * @param {*} argCount? 其他参数 可选
 * @returns 
 */
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

/**
 * 返回对象的可枚举属性
 * 
 * @param {*} obj 对象
 * @returns 属性集合
 */
function keys(obj){
  if (!isObject(obj)) return []
  if (nativeKeys) return nativeKeys(obj)
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);

  return keys
}

/**
 * 遍历对象和数组
 * 
 * @param {*} obj 处理对象||数组 
 * @param {*} callback 回调函数
 * @param {*} context 绑定的this
 * @returns 
 */
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

var isArray = nativeIsArray || tagTester('Array');

var isArguments = tagTester('Arguments');

/**
 * 返回对象的浅层属性
 * @param {*} key 
 */
function shallowProperty(key) {
  return function (obj){
    return obj == null ? void 0 : obj[key]
  }
}

var getLength = shallowProperty('length');

/**
 * 数组扁平化处理
 * 
 * @param {Array} input 输入的数组
 * @param {Boolean} shallow 是否浅拷贝
 * @param {Boolean} strict 是否严格模式 严格模式开启时 只会打平 array 类型其余类型全部过滤
 * @param {Array} output 输出的数组
 */
function flatten(input, shallow, strict, output){
  output = output || [];
  var idx = output.length;
  for(var i = 0, length = getLength(input); i < length; i++){
    var value = input[i];
    // 确保是数组或者是类数组
    if(isArrayLink(input) && (isArray(input) || isArguments(input))){
      if(shallow){
        var j = 0, len = value.length;
        while(j < len) output[idx++] = value[j++];
      }else {
        flatten(value, shallow, strict, output);
        idx = output.length; 
      }
    }else if(!strict){
      output[idx++] = value; 
    }
  }
  return output
}

var ObjGetSymbol = Object.getOwnPropertySymbols;

/**
 * 遍历对象上的属性 也包含 symbol 属性
 * 
 * @see 所有的对象在初始化的时候不会包含任何的 Symbol 所以除非自己创建了这个属性 我们需要遍历
 *      https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
 * 
 * @param {*} obj 获取一个对象
 * 当没有 symbol 属性时候就会像 keys() 函数一样
 */
function hasSymbolKeys(obj){
  var objKeys = keys(obj);
  if(!!ObjGetSymbol) return objKeys
  var symbolKeys = ObjGetSymbol(obj);
  // 不存在 symbol 属性时候
  if(!!symbolKeys.length) return objKeys
  objKeys[objKeys.length] = symbolKeys;
  return flatten(objKeys)
}

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

/**
 * 传入的剩余参数 
 * 
 * 如果传入超过函数原本的参数那么都会以 rest 参数的方式传入进去
 * 原理：(1, 2, ...res) => apply(x, [1, 2, [x, x, x]])
 * @param {*} func 函数 
 * @param {*} startIndex 从第几位开始指定 rest  
 */
function restArguments(func, startIndex){
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function (){
    var length = Math.max(arguments - startIndex, 0),
        rest = Array(length),
        index = 0;
    for(; index < length; index++){
      rest[index] = arguments[length + index];
    }

    // 当传入的函数的参数小于等于1时就不会进入到这里面
    switch(startIndex){
      case 0: return func.call(this, rest)
      case 1: return func.call(this, arguments[0], rest)
      case 2: return func.call(this, arguments[0], arguments[1], rest)
    }

    var args = Array(length + 1);
    for(index = 0; index < startIndex; index++){
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args)
  }
}

/**
 * 克隆函数 
 * @param {*} func 
 * @returns 
 */
function cloneFunction(func){
  return func || {}
}

var symbolValueOf = Symbol.prototype.valueOf;

/**
 *克隆 symbol 类型 
 * @param {*} symbol symbol 类型 
 * @returns 
 */
function cloneSymbol(symbol){
  return symbolValueOf(symbol)  
}

/**
 * 克隆正则
 * 内部函数 确保 reg 是正则才行
 * @param {*} reg 
 * @returns {*} 返回值正则类型 
 */
function cloneReg(reg){
  // 找到正则尾后的字母
  var reFlags = /\w*$/;
  var result = new RegExp(reg.source, reFlags.exec(reg));
  result.lastIndex = reg.lastIndex;
  return result
}

function cloneOtherType(target, type){
  if(typeof target === 'undefined' || type === undefined) return void 0
  
  if(target === null) return null 

  if(type == null){
    type = getType(target);
  }

  var Ctor  = target['constructor'];
  
  switch (type) {
    case 'Number':
    case 'String':
    case 'Boolean':
    case 'Error':
    case 'number':
    case 'Date':
      return new Ctor(target) 
    case 'RegExp':
      return cloneReg(target)
    case 'Symbol':
      return cloneSymbol(target)
    case 'Function':
      return cloneFunction(target)
    default:
      return null 
  }
}

var createInstance = [
  { 'Object': new Object() },
  { 'Map': new Map() },
  { 'Set': new Set() },
  { 'Array': new Array() }
];

/**
 * 获得可遍历类型，创建相同类型的对象
 * @param {*} obj 
 * @param {*} type 
 * @returns {*} 返回与 obj 相同类型的对象
 */
function getInit(obj, type) {
  var Ctor = obj.constructor;
  var newObj = new Ctor();

  // 说明对象的 constructor 被修改
  if (getType(newObj) !== type) {
    createInstance.forEach((item) => {
      if (typeof item[type] === 'function') {
        return item[type]
      }
    });
  }
  return newObj
}

// 可遍历对象 object, map, set, array
var targetTypes = ['Object', 'Map', 'Set', 'Array'];

function deepClone(obj, map = new WeakMap()) {
  var type = getType(obj);

  // 处理不可遍历对象
  if (!targetTypes.includes(type)) {
    return cloneOtherType(obj, type)
  }

  // 初始化
  var cloneTarget = getInit(obj, type);

  // 如果有记录的值就会取出返回 --> 防止循环引用 
  if (!!map.get(obj)) {
    return map.get(obj)
  }
  map.set(obj, cloneTarget);

  // map set symbol 类型都会去单独的处理
  if(type === 'Map'){
    obj.forEach((value, key)=>{
      cloneTarget.set(key, deepClone(value));
    });
    return cloneTarget
  }

  if(type === 'Set'){
    obj.forEach(value => {
      cloneTarget.add(deepClone(value, map));
    });
    return cloneTarget
  }
  
  // 这里要考虑 遍历对象和数组 但是处理对象也要考虑到 symbol 
  var keys = type === 'Array' ? void 0 : hasSymbolKeys(obj);
  each(keys || obj, function(value, key){
    if(keys){
      key = value; 
    }
    cloneTarget[key] = deepClone(obj[key], map);
  });
  return cloneTarget
}

function radomId(){
  // todo 获取传入的参数生成 md5 或者是一些其他的东西

  // 生成 10 位随机数
  var id = Math.random().toString(32).slice(2);
  return id 
}

var allExports = {
  __proto__: null,
  log: log,
  getType: getType,
  each: each,
  isObject: isObject,
  isFunction: isFunction,
  isArray: isArray,
  isArguments: isArguments,
  keys: keys,
  hasSymbolKeys: hasSymbolKeys,
  functions: functions,
  mixin: mixin,
  restArguments: restArguments,
  deepClone: deepClone,
  radomId: radomId
};

var _ = mixin(allExports);

_._ = _;

exports._ = _;
exports.deepClone = deepClone;
exports.each = each;
exports.functions = functions;
exports.getType = getType;
exports.hasSymbolKeys = hasSymbolKeys;
exports.isArguments = isArguments;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.keys = keys;
exports.log = log;
exports.mixin = mixin;
exports.radomId = radomId;
exports.restArguments = restArguments;
