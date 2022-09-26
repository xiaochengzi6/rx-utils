import isFunction from "./isFunction"

// 遍历找出对象上所有的函数
export default function functions (obj) {
  var names = []

  for(var key in obj){
    if(isFunction(obj[key])){
      names.push(key)
    }
  }
  
  return names.sort()
}