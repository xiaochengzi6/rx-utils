import _ from '../rx-node.mjs'
_.add = function (x, y){
return x + y
}

function forEach(array, iteratee){
  let index = -1
  const length = array.length
  while(++index < length){
    iteratee(array[index], index)
  }
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


_.log(getType(new Set()))
function getType(obj){
  return Object.prototype.toString.call(obj).slice(8, -1)
}

/**
 * 深拷贝
 * 
 * 遍历类型 object array map set 
 * @param target 目标值
 * @param map WeakMap
 */
function Clone(target, map = new WeakMap()){
  const targetTypes = ['Object', 'Map', 'Set', 'Array']
  if(!target) return 
  const type = getType(target)
  if(!targetTypes.includes(type)) return target 

  

  const getMapValue = map.get(target)
  if(getMapValue) return getMapValue 
  map.set(target)
}