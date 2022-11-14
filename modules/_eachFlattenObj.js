import isObject from "../modules/isObject"
import has from "../modules/_has"

/**
 * 遍历对象 返回 iteratee 函数处理后的对象
 * 
 * @param {*} obj 目标对象
 * @param {*} callback 回调函数 
 * @param {*} deep 是否深递归 
 * @param {*} output 返回上一次运行的值
 * @returns 
 */
export default function eachFlattenObj(obj, iteratee, deep, output) {
  var result = output || {}
  if (!isObject(obj)) return result

  for (var key in obj) {
    if (has(obj, key)) {
      if (deep) {
        if (isObject(obj[key])) {
          eachFlattenObj(obj[key], iteratee, deep, result)
        } else {
          // 如果 iteratee 不返回值就默认返回 obj[key]
          result[key] = iteratee(obj[key], key, obj) || obj[key]
        }
      } else {
        result[key] = iteratee(obj[key], key, obj) || obj[key]
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