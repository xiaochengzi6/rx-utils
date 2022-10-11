import _ from '../rx-node.mjs'
_.add = function (x, y){
return x + y
}



/**
 * 深拷贝 object array
 * @param {*} obj 
 */
function deepClone(target, map = new WeakMap()){
  if(target == null) return 
  if(isObject(target)) return target 


  var isArray = Array.isArray(obj)
  let cloneTarge = isArray ? [] : {}
  var value = map.get(target)
  if(value){
    return value
  }
  map.set(target, cloneTarge)
  var keys = isArray ? undefined : Object.keys(obj)
  // 对数组和对象进行遍历
  forEach(keys | target, function(value, key){
    if(keys){
      key = value 
    }
    cloneTarge[key] = deepClone(target[key], map)
  })

  return cloneTarge
}

function isObject(obj){
  var type = typeof obj
  return type === 'function' || (type === 'object' && obj)
}

function getType(obj){
  return Object.prototype.toString.call(obj).slice(8, -1)
}

// 获取该对象的 constructor 从而创建对象
function getInit(obj, type){
  var createInstance = [
    {'Object': function (){return new Object()}}, 
    {'Map': function(){return new Map()}},
    {'Set': function(){return new Set()}},
    {'Array': function(){return []}}
  ]
  var Ctor = obj.constructor
  var newObj = new Ctor()
 if( getType(newObj) !== type){
    // 说明对象的 constructor 被修改
    createInstance.forEach((item)=>{
      if(typeof item[type] === 'function'){
        return item[type]()
      }
    })
 }
 return newObj
}

function forEach(array, iteratee){
  let index = -1
  const length = array.length
  while(++index < length){
    iteratee(array[index], index)
  }
}
function cloneReg(target){
  var regPattern = /\w*&/g
  var result = new RegExp(target.source, regPattern.exec(target))
  result.lastIndex = target.lastIndex
  return result 
}

function cloneSymbol(target){
  return Object(Symbol.prototype.valueOf.call(target));
}

/**
 * 复制函数
 * 缺点：丢失 this 丢失 prototype 丢失很多东西 只能往外面传不能收
 * 函数的参数不能接收 因为被 ()() 包裹 函数的返回值也不能在合适的位置收到
 * @param {*} target 
 * @param {*} context 
 * @returns 
 */
function cloneFunc(target){
  if(!target.toString) return function (){}
  if(!target.name) {
    console.log('sss')
    var funcName = 'RANDOM_FUNCTION_NAME_' + Math.random(1).toString(32).slice(2)
    /**
     * @see 修改函数名 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     */
    Object.defineProperty(target, 'name', {value: funcName,configurable: true}) 
  }
  var funcToString = target.toString()
  // 将函数包裹成IIFE类型从而能够子调用
  funcToString = '(' + funcToString + `)()`
  var result = eval.bind(Object.create({}), funcToString)
  return result
}

function isFunction(obj){
  typeof obj === 'function'
}

function clone_Func (obj){
  return obj 
}
function cloneOtherType(target, type, context){
  if(typeof target === 'undefined' || type === undefined) return void 0
  if(target === null) return null 

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
      return clone_Func(target, context)
    default:
      return null 
  }
}

/**
 * 深拷贝
 * 
 * 遍历类型 object array map set 
 * @param target 目标值
 * @param map WeakMap
 */
function Clone(target, map = new WeakMap()){
  var targetTypes = ['Object', 'Map', 'Set', 'Array']
  var type = getType(target)
  // 不是可遍历对象
  if(!targetTypes.includes(type)){
    return cloneOtherType(target, type)
  }
  // 创建对象的类型对象
  var cloneTarget = getInit(target, type)
  // 防止循环引用
  const getMapValue = map.get(target)
  if(getMapValue) return getMapValue 

  map.set(target, cloneTarget)

  // Set
  if(type === 'Set'){
    target.forEach(value => {
      cloneTarget.add(clone(value, map))
    })
    return cloneTarget
  }

  // Map
  if(type === 'Map'){
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map))
    })
    return cloneTarget
  }

  // array and object
  var keys = type === 'Array' ? undefined : Object.keys(target)
  forEach(keys || target, (value, key)=>{
    if(keys){
      key = value 
    }
    cloneTarget[key] = Clone(target[key], map)
  })
  return cloneTarget
}

const target = {
  field1: 1,
  field2: undefined,
  field3: {
      child: 'child'
  },
  field4: [2, 4, 8],
  empty: null,
  map: new Map(),
  set: new Set(),
  func: function a (a, b){
    
    return a + b + this.field1
  }
};

// test 
var result = Clone(target)
_.log(result)
_.log(result.func(1,2))

/**
 * todo 复制函数有问题 需要考虑正则的处理 
 */