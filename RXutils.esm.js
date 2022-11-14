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

function identity(value) {
  return value 
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

function tagTester(name){
  var tag = '[object ' + name + ']';

  return function(obj){
    return toString.call(obj) === tag
  }
}

var isFunction = tagTester('Function');

var isArray = nativeIsArray || tagTester('Array');

var isArguments = tagTester('Arguments');

function allKeys(obj){
  if(!isObject) return []
  if(nativeKeys) return nativeKeys
  var keys = [];
  for(var key in obj) keys.push(key);

  return keys 
}

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

_$1.prototype.valueOf = _$1.prototype.toJson = _$1.prototype.value;

_$1.prototype.toString = function() {
  return String(this._wrapped)
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
 * 柯里化函数 用于对象的合并
 * 
 * var extends = createAssigner(_.keys)
 * var b = a({}, {a: 1}, {b: 2}) ===> {a: 1, b: 2}
 * 
 * @param {*} keysFunc 对象 keys 集合
 * @param {*} defaults 默认对象
 * @returns 复制后的对象
 */
function createAssigner(keysFunc, defaults){
  return function (obj){
    var length = arguments.length;
    if(defaults) obj = Object(obj);
    if(length < 2 || obj == null) return obj
    for(var index = 1; index < length; index++){
      var source = arguments[i];
      var keys = keysFunc(source);
      l = keys.length;
      for(var i = 1; i < l; i++){
        var key = keys[i];
        if(!defaults || obj[key] === void 0){
          obj[key] = source[key];
        }
      }
    }

    return obj 
  }
}

const extendOwn = createAssigner(allKeys);

/**
 * 判断目标对象 obj 中的属性有没有 attrs 对象
 * 例如: [{name:'Kevin'}, {name: 'Daisy', age: 18}], {name: 'Daisy'} ==> [false, true]
 * 
 * @param {*} obj 目标对象
 * @param {*} attrs 传入的对象
 * @returns boolean 
 */
function isMatch(obj, attrs){
  var _keys = keys(obj), length = _keys.length;

  if(obj == null) return !length

  var _obj = Object(obj);
  for(var i = 0; i < length; i++){
    var key = _keys[i];
    if(attrs[key] !== _obj[key] || !(key in _obj)) return false 
  }
  return true 
}

/**
 * 返回一个断言函数用来判断属性是否是这个对象的
 * 
 * 1. 拷贝传入的对象
 * 2. 判断两个对象中的值是否相同并返回结果
 * 
 * @param {*} attrs 
 * @returns 
 */
function matcher(attrs){
  attrs = extendOwn({}, attrs); 
  return function (obj){
    return isMatch(obj, attrs)
  }
}

function deepGet(obj, path){
  var length = path.length;
  for(var i = 0; i < length; i++){
    if(obj == null) return void 0
    obj = obj[path[i]];
  }

  return length ? obj : void 0 
}

/**
 * 返回一个函数，该函数将返回任何传入对象的指定属性
 * 
 * 1. 如果 value 是简单类型 string 那么就会返回一个函数 
 * 2. 如果 value 是一个数组 那么就会采用深递归的方式取得最终值例如 ([{a: 1},{b: {c: 1}}], [b, c]) ===> 1
 * @param {*} value 
 * @returns 
 */
function property(value){
  if(!isArray(value)){
    return shallowProperty(value)
  }
  return function (obj){
    return deepGet(obj, value)
  }
}

function iteratee (value, context){
  return cb(value, context, Infinity)
}

_$1.iteratee = iteratee;

const builtinIteratee = iteratee;

var builtinIteratee$1 = builtinIteratee;

/**
 * 回调函数参数类型不定的处理
 * 
 * 1. 如果_.iteratee 被修改 就是用 _.iteratee
 * 2. 如果参数 iteratee 没有值 就直接返回
 * 3. 如果参数 iteratee 是一个函数 正常处理
 * 4. 如果参数 iteratee 是一个对象也不是数组 返回和这个对象匹配的数组类似于 cb([{b: 1}, {a: 1}], {a: 1}) ===> [false, true
 * 
 * @param {*} iteratee 
 * @param {*} context 
 */
function cb(value, context, argCount){
  if(_$1.iteratee !== builtinIteratee$1) return _$1.iteratee(value, context)
  if(value == null) return identity
  if(isFunction(value)) return optimizeCb(value, context, argCount)
  if(isObject(value) || !isArray(value)) return matcher(value)
  
  return property(value)
}

/**
 * 遍历数组
 * 
 * 返回一个每次使用遍历函数处理过的数组
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
function map (obj, iteratee, context){
  iteratee = cb(iteratee, context);

  var length = obj.length, result = Array.length(length);
  for(var i = 0; i < length; i++){
    result[i] = iteratee(obj[index], index, obj);
  }
  return result 
}

/**
 * 克隆函数 
 * @param {*} func 
 * @returns 
 */
function cloneFunction(func){
  return func || {}
}

/**
 * 克隆函数这里也有许多问题 我深度研究过
 * 具体方法两种 但这两种都明显不科学
 * 1、使用 eval 
 * 2、使用 new Function ()
 * 
 * @see https://github.com/xiaochengzi6/Blog/issues/5#issuecomment-1272406786
 * 如果深入的学习过函数作用域的都知道 函数在创建或者说在书写的时候就已经明确函数的作用域了
 * 你在重新创建函数岂不是会丢失 this 以及其内部标识符查询时无法按照原先的作用域链访问索引符
 * 还是就是使用 new Function () 它不能够为 箭头函数创建函数，第二个就是使用 new Function ()创建的函数
 * 作用域链的查找过程是 scope = Ao + globAO  因为 new Function 是在全局定义的有且只有一个...
 */


/**
 * 使用 eval 克隆函数的实现 
 * 
 * 
 * 复制函数
 * 缺点：丢失 this 丢失 prototype 丢失很多东西 只能往外面传不能收
 * 函数的参数不能接收 因为被 ()() 包裹 函数的返回值也不能在合适的位置收到
 * @param {*} target 
 * @param {*} context 
 * @returns 
 */
 function cloneFunc_test_demo_bad(target){
  if(!target.toString) return function (){}
  if(!target.name) {
    console.log('sss');
    var funcName = 'RANDOM_FUNCTION_NAME_' + Math.random(1).toString(32).slice(2);
    /**
     * @see 修改函数名 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     */
    Object.defineProperty(target, 'name', {value: funcName,configurable: true}); 
  }
  var funcToString = target.toString();
  // 将函数包裹成IIFE类型从而能够子调用
  funcToString = '(' + funcToString + `)()`;
  var result = eval.bind(Object.create({}), funcToString);
  return result
}

var symbolValueOf = Symbol.prototype.valueOf;

/**
 *克隆 symbol 类型 
 * @param {*} symbol symbol 类型 
 * @returns 
 */
function cloneSymbol(symbol){
  return symbolValueOf.call(symbol)  
}

/**
 * 关于 symbol 做了一个demo 
 * var a = Symbol('default')
 * var b = Symbol.prototype.valueOf
 * var c = b.call(a)
 * 
 * a == c // true 
 * a === c // true 
 * 
 * 有些例子使用 Object() 将之(Symbol.prototype.valueOf.call(xxx))包裹我认为可能有些多余 或者说方法过时
 * @see https://juejin.cn/post/6844903929705136141#heading-9
 */

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

  switch (type) {
    case 'Number':
    case 'String':
    case 'Boolean':
    case 'Error':
    case 'number':
    case 'Date':
      return target
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

/**
 * 遍历对象 
 * 
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
function mapObj(obj, iteratee, context){
  iteratee = cb(iteratee, context);
  
  var _keys = keys(obj), length = _keys(obj), results = {};
  for(var i = 0; i< length; i++){
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results 
}

const extend = createAssigner(keys);

/**
 * 遍历对象 返回 iteratee 函数处理后的对象
 * 
 * @param {*} obj 目标对象
 * @param {*} callback 回调函数 
 * @param {*} deep 是否深递归 
 * @param {*} output 返回上一次运行的值
 * @returns 
 */
function eachFlattenObj(obj, iteratee, deep, output) {
  var result = output || {};
  if (!isObject(obj)) return result

  for (var key in obj) {
    if (has(obj, key)) {
      if (deep) {
        if (isObject(obj[key])) {
          eachFlattenObj(obj[key], iteratee, deep, result);
        } else {
          // 如果 iteratee 不返回值就默认返回 obj[key]
          result[key] = iteratee(obj[key], key, obj) || obj[key];
        }
      } else {
        result[key] = iteratee(obj[key], key, obj) || obj[key];
      }
    }
  }

  return result
}


/**
 * 存在的问题:
 * 1. 不能处理 map set 等值 还有循环引用..
 * 2. 相同属性存在覆盖现象
 * 
 */

/**
 * 打平对象，iteratee 函数处理打平后的每一个属性
 * 
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
function flattenObj(obj, iteratee, context) {
  iteratee = iteratee == null 
   ? identity 
   : cb(iteratee, context);
   
  return eachFlattenObj(obj, iteratee, true, {})
}

/**
 * 遍历对象 (但不会返回任何值)
 * 
 * @param {*} obj 目标对象
 * @param {*} iteratee 回调函数(value, key, obj)
 * @returns 
 */
function eachObj(obj, iteratee) {
  if (isObject(obj)) return void 0

  iteratee = cb(iteratee);

  var _keys = keys(result);
  for (var i, len = _keys.length; i < len; i++) {
    var key = _keys[i];
    iteratee(obj[key], key, obj);
  }
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
  identity: identity,
  restArguments: restArguments,
  isObject: isObject,
  isFunction: isFunction,
  isArray: isArray,
  isArguments: isArguments,
  keys: keys,
  allKeys: allKeys,
  hasSymbolKeys: hasSymbolKeys,
  functions: functions,
  mixin: mixin,
  map: map,
  deepClone: deepClone,
  mapObj: mapObj,
  extend: extend,
  extendOwn: extendOwn,
  flattenObj: flattenObj,
  eachObj: eachObj,
  radomId: radomId
};

var _ = mixin(allExports);

_._ = _;

export { allKeys, deepClone, _ as default, each, eachObj, extend, extendOwn, flattenObj, functions, getType, hasSymbolKeys, identity, isArguments, isArray, isFunction, isObject, keys, log, map, mapObj, mixin, radomId, restArguments };
//# sourceMappingURL=RXutils.esm.js.map
