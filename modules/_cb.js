import identity from "./identity.js"
import isArray from "./isArray.js"
import isFunction from "./isFunction.js"
import isObject from "./isObject.js"
import iteratee from "./iteratee.js"
import matcher from "./matcher.js"
import property from "./property.js"
import builtinIteratee from "./_builtinIteratee.js"
import optimizeCb from "./_optimizeCb.js"


/**
 * 回调函数参数类型不定的处理
 * 
 * 1. 如果参数 iteratee 没有值 返回原数组/原对象
 * 2. 如果参数 iteratee 是一个函数 正常处理
 * 3. 如果参数 iteratee 是一个对象 返回和这个对象匹配的数组类似于 cb([{b: 1}, {a: 1}], {a: 1}) ===> [false, true]
 * 4. 如果参数 iteratee 是一个字符串 或者是一个数组时 返回相对应的属性集合
 * 
 * @param {*} iteratee 
 * @param {*} context 
 */
export default function cb(value, context, argCount){
  if(iteratee !== builtinIteratee) return iteratee(value, context)
  if(value == null) return identity
  if(isFunction(value)) return optimizeCb(value, context, argCount)
  if(isObject(value) || !isArray(value)) return matcher(value)
  
  return property(value)
}