import _ from '../rx-node.mjs'
_.add = function (x, y){
return x + y
}

/**
 * 深拷贝
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


_.log(getType({}))
function getType(obj){
  return Object.prototype.toString.call(obj).slice(8, -1)
}