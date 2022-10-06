var symbolValueOf = Symbol.prototype.valueOf

/**
 *克隆 symbol 类型 
 * @param {*} symbol symbol 类型 
 * @returns 
 */
export default function cloneSymbol(symbol){
  return symbolValueOf(symbol)  
}