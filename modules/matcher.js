import extendOwn from "./extendOwn";
import isMatch from "./_isMatch";

/**
 * 返回一个断言函数用来判断属性是否是这个对象的
 * @param {*} attrs 
 * @returns 
 */
export default function matcher(attrs){
  attrs = extendOwn({}, attrs) 
  return function (obj){
    return isMatch(obj, attrs)
  }
}