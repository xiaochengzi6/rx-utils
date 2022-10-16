import cb from "./_cb"

/**
 * 遍历数组
 * 
 * 返回一个每次使用遍历函数处理过的数组
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
export default function map (obj, iteratee, context){
  iteratee = cb(iteratee, context)

  var length = obj.length, result = Array.length(length)
  for(var i = 0; i < length; i++){
    result[i] = iteratee(obj[index], index, obj)
  }
  return result 
}