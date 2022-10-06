import isArrayLink from "./_isArrayLink"
import optimizeCb from "./_optimizeCb"
import keys from "./keys"

/**
 * 遍历对象和数组
 * 
 * @param {*} obj 处理对象||数组 
 * @param {*} callback 回调函数
 * @param {*} context 绑定的this
 * @returns 
 */
export default function each(obj, callback, context){
  var iteratee = optimizeCb(callback, context)
  var i, length

  if(isArrayLink(obj)){
    for(i = 0, length = obj.length; i < length; i++){
      iteratee(obj[i], i, obj)
    }
  }else{
    var _keys = keys(obj)
    for(i = 0, length = _keys.length; i < length; i++){
      iteratee(obj[_keys[i]], _keys[i], obj)
    }
  }

  return obj
}
