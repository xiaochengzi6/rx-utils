var symbolValueOf = Symbol.prototype.valueOf

/**
 *克隆 symbol 类型 
 * @param {*} symbol symbol 类型 
 * @returns 
 */
export default function cloneSymbol(symbol){
  return symbolValueOf.call(symbol)  
}

/**
 * 关于 symbol 做了一个demo 
 * var a = Symbol('default')
 * var b = Symbol.prototype.valueOf
 * var c = b.call(a)
 * 
 * a == c // true 
 * a === c // true 
 * 
 * 有些例子使用 Object() 将之(Symbol.prototype.valueOf.call(xxx))包裹我认为可能有些多余 或者说方法过时
 * @see https://juejin.cn/post/6844903929705136141#heading-9
 */