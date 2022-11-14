import isObject from "../modules/isObject"
import keys from "../modules/keys"
import cb from "../modules/_cb"

/**
 * 遍历对象 (但不会返回任何值)
 * 
 * @param {*} obj 目标对象
 * @param {*} iteratee 回调函数(value, key, obj)
 * @returns 
 */
export default function eachObj(obj, iteratee) {
  if (isObject(obj)) return void 0

  iteratee = cb(iteratee)

  var _keys = keys(result)
  for (var i, len = _keys.length; i < len; i++) {
    var key = _keys[i]
    iteratee(obj[key], key, obj)
  }
}