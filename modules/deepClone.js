import getType from "./getType"
import cloneOtherType from "./_cloneOtherType"
import getInit from "./_getInit"
import each from "./each"
import hasSymbolKeys from "./hasSymbolKeys"

// 可遍历对象 object, map, set, array
var targetTypes = ['Object', 'Map', 'Set', 'Array']

export default function deepClone(obj, map = new WeakMap()) {
  var type = getType(obj)

  // 处理不可遍历对象
  if (!targetTypes.includes(type)) {
    return cloneOtherType(obj, type)
  }

  // 初始化
  var cloneTarget = getInit(obj, type)

  // 如果有记录的值就会取出返回 --> 防止循环引用 
  if (!!map.get(obj)) {
    return map.get(obj)
  }
  map.set(obj, cloneTarget)

  // map set symbol 类型都会去单独的处理
  if(type === 'Map'){
    obj.forEach((value, key)=>{
      cloneTarget.set(key, deepClone(value))
    })
    return cloneTarget
  }

  if(type === 'Set'){
    obj.forEach(value => {
      cloneTarget.add(deepClone(value, map))
    })
    return cloneTarget
  }
  
  // 这里要考虑 遍历对象和数组 但是处理对象也要考虑到 symbol 
  var keys = type === 'Array' ? void 0 : hasSymbolKeys(obj)
  each(keys || obj, function(value, key){
    if(keys){
      key = value 
    }
    cloneTarget[key] = deepClone(obj[key], map)
  })
  return cloneTarget
}