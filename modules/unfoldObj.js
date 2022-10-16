import isObject from "./isObject";
import { hasOwnProperty } from "./_setUp";

/**
 * 平铺对象属性
 * 
 * @param {*} obj 
 * @param {*} output 
 * @returns 
 */
export default function unfoldObj (obj, output){
  let result = output || {} 
  for(var key in obj){
    if(hasOwnProperty.call(obj, key)){
      if(isObject(obj)){
        unfoldObj(obj[key], {})
      }else{
        result[key] = obj[key]
      }
    }
  }

  return result 
}

/**
 * 存在的问题 就是不能处理 map set 等值 还有循环引用..
 */
