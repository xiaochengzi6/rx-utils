export { default as log } from './log'

export { default as getType } from './getType'

// 函数 
export { default as each } from './each'
export { default as identity } from './identity'                  /* 返回参数 */
export { default as restArguments } from './restArguments'        /**剩余参数 */

// 判断
export { default as isObject } from './isObject'
export { default as isFunction } from './isFunction'
export { default as isArray } from './isArray'
export { default as isArguments } from './isArguments'

// 获取属性的所有值
export { default as keys } from './keys'
export { default as allKeys } from './allKeys'
export { default as hasSymbolKeys } from './hasSymbolKeys'        /** 找到对象上所有的属性包裹 symbol */
export { default as functions } from './functions'                /**找到对象上所有的函数 */

// 将属性混入原型链上
export { default as mixin } from './mixin'


// 数组
export { default as map } from './map'

// 对象 
export { default as deepClone } from './deepClone'                 /** 深拷贝 */
export { default as mapObj } from './mapObj'                       /* 遍历对象（浅层遍历）会返回值 */
export { default as extend } from './extend'                       /* 多个组合对象 */
export { default as extendOwn } from './extendOwn'                 /* 组合多个对象 （所有属性） */
export { default as flattenObj } from './flattenObj'               /* 对象属性的平铺(深度遍历)后使用函数回调处理并返回处理的值*/
export { default as eachObj } from './eachObj'                     /* 遍历对象（浅层遍历）不会有返回值 */

// 额外的
export { default as radomId } from './radomId'                    /**生成随机 Id */
