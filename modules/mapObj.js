import keys from "./keys";
import cb from "./_cb";

/**
 * 遍历对象 
 * 
 * @param {*} obj 
 * @param {*} iteratee 
 * @param {*} context 
 * @returns 
 */
export default function mapObj(obj, iteratee, context){
  iteratee = cb(iteratee, context)
  
  var _keys = keys(obj), length = _keys(obj), results = {}
  for(var i = 0; i< length; i++){
    var currentKey = _keys[index]
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj)
  }
  return results 
}
