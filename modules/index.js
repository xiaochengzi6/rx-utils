export { default as log } from './log'

export { default as getType } from './getType'

// 遍历函数 
export { default as each } from './each'

// 用于判断
export { default as isObject } from './isObject'
export { default as isFunction } from './isFunction'
export { default as isArray } from './isArray'
export { default as isArguments } from './isArguments'



// 获取属性的所有值
export { default as keys } from './keys'
export { default as hasSymbolKeys } from './hasSymbolKeys'        /** 找到对象上所有的属性包裹 symbol */
export { default as functions } from './functions'                /**找到对象上所有的函数 */

// 将属性混入原型链上
export { default as mixin } from './mixin'


export { default as restArguments} from './restArguments'        /**剩余参数 */

// 数组


// 对象 
export { default as deepClone} from './deepClone'                 /**深拷贝 */


// 额外的
export { default as radomId } from './radomId'                    /**生成随机 Id */
