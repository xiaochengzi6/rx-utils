import cb from "../modules/_cb"
import identity from "./identity"
import eachFlattenObj from "./_eachFlattenObj"

/**
 * 打平对象，iteratee 函数处理打平后的每一个属性
 * 
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
export default function flattenObj(obj, iteratee, context) {
  iteratee = iteratee == null 
   ? identity 
   : cb(iteratee, context)
   
  return eachFlattenObj(obj, iteratee, true, {})
}

