import _flatten from "./_flatten"

/**
 * 打平数组 
 * [1,[2,[3]]] => [1,2,3]
 * 
 * @param {*} array 
 * @param {*} deep true 浅层打平 false [默认] 全部打平
 * @returns 
 */
export default function flatten(array, deep){
  return _flatten(array, deep, false)
}