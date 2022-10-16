

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
export default function createAssigner(keysFunc, defaults){
  return function (obj){
    var length = arguments.length
    if(defaults) obj = Object(obj)
    if(length < 2 || obj == null) return obj
    for(var index = 1; index < length; index++){
      var source = arguments[i]
      var keys = keysFunc(source)
      l = keys.length
      for(var i = 1; i < l; i++){
        var key = keys[i]
        if(!defaults || obj[key] === void 0){
          obj[key] = source[key]
        }
      }
    }

    return obj 
  }
}