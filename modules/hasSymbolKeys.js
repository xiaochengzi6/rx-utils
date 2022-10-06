import keys from "./keys"
import flatten from "./_flatten"

var ObjGetSymbol = Object.getOwnPropertySymbols

/**
 * 遍历对象上的属性 也包含 symbol 属性
 * 
 * @see 所有的对象在初始化的时候不会包含任何的 Symbol 所以除非自己创建了这个属性 我们需要遍历
 *      https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
 * 
 * @param {*} obj 获取一个对象
 * 当没有 symbol 属性时候就会像 keys() 函数一样
 */
export default function hasSymbolKeys(obj){
  var objKeys = keys(obj)
  if(!!ObjGetSymbol) return objKeys
  var symbolKeys = ObjGetSymbol(obj)
  // 不存在 symbol 属性时候
  if(!!symbolKeys.length) return objKeys
  objKeys[objKeys.length] = symbolKeys
  return flatten(objKeys)
} 