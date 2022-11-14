import extendOwn from "./extendOwn";
import isMatch from "./_isMatch";

/**
 * 返回一个断言函数用来判断属性是否是这个对象的
 * 
 * 1. 拷贝传入的对象
 * 2. 判断两个对象中的值是否相同并返回结果
 * 
 * @param {*} attrs 
 * @returns 
 */
export default function matcher(attrs){
  attrs = extendOwn({}, attrs) 
  return function (obj){
    return isMatch(obj, attrs)
  }
}