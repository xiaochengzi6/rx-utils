import getType from './getType'

var createInstance = [
  { 'Object': new Object() },
  { 'Map': new Map() },
  { 'Set': new Set() },
  { 'Array': new Array() }
]

/**
 * 获得可遍历类型，创建相同类型的对象
 * @param {*} obj 
 * @param {*} type 
 * @returns {*} 返回与 obj 相同类型的对象
 */
export default function getInit(obj, type) {
  var Ctor = obj.constructor
  var newObj = new Ctor()

  // 说明对象的 constructor 被修改
  if (getType(newObj) !== type) {
    createInstance.forEach((item) => {
      if (typeof item[type] === 'function') {
        return item[type]
      }
    })
  }
  return newObj
}