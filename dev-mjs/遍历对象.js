
/**
 * 遍历对象
 * 
 * @param {*} obj 对象
 * @param {*} callback 回调函数 
 * @param {*} deep 是否深递归 
 * @param {*} output 返回上一次运行的值
 * @returns 
 */
function eachObj (obj, callback, deep, output){
  if(!obj || typeof obj !== 'object') return void 0
  let result = output || void 0
  for(let key in obj){
    if(Object.prototype.hasOwnProperty.call(obj, key)){

      if(deep){
        if(typeof obj[key] === 'object'){
          eachObj(obj[key], callback, deep, result)
        }else{
          result = callback.call(this, obj[key], key, obj, output)
        }
      }else{
        result = callback.call(this, obj[key], key, obj, output)
      }
    }
  }

  return result 
}
// ==============测试===============
var mock_a = {
  a: 1,
  b: 2,
  c: {
    d: 'd'
  },
  e: [1,2,3]
}


// var result = {}
// const _a  = eachObj(mock_a, function (value, key, obj, lastValue){
//   result[key] = value
//   console.log('lastValue', lastValue)
//   return result 
// }, true)

// console.log('result', _a)

function mapObj(obj, iteratee, context){
  iteratee = cb(iteratee, context)
}