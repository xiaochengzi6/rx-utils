import { MAX_ARRAY_INDEX } from "./_setUp"

/**
 * 判断是否是类数组
 * 
 * 具有 length 属性，且 length >= 0 且 length 小于最大值
 * @param {*} obj 
 * @returns 
 */
export default function isArrayLink(obj){
  var length = obj.length
  if(obj && typeof length === 'number' && length >= 0 && length < MAX_ARRAY_INDEX){
    return true
  }
  return false
}