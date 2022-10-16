import deepGet from "./deepGet";
import isArray from "./isArray";
import shallowProperty from "./_shallowProperty";

/**
 * 返回一个函数，该函数将返回任何传入对象的指定属性
 * 
 * 1. 如果 value 是简单类型 string 那么就会返回一个函数 
 * 2. 如果 value 是一个数组 那么就会采用深递归的方式取得最终值例如 ([{a: 1},{b: {c: 1}}], [b, c]) ===> 1
 * @param {*} value 
 * @returns 
 */
export default function property(value){
  if(!isArray(value)){
    return shallowProperty(value)
  }
  return function (obj){
    return deepGet(obj, value)
  }
}