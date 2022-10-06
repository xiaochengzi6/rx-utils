import isObject from './isObject'
import has from './_has'
import { nativeKeys } from './_setUp'

/**
 * 返回对象的可枚举属性
 * 
 * @param {*} obj 对象
 * @returns 属性集合
 */
export default function keys(obj){
  if (!isObject(obj)) return []
  if (nativeKeys) return nativeKeys(obj)
  var keys = []
  for (var key in obj) if (has(obj, key)) keys.push(key)

  return keys
}