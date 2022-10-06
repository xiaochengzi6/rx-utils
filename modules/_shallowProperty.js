/**
 * 返回对象的浅层属性
 * @param {*} key 
 */
export default function shallowProperty(key) {
  return function (obj){
    return obj == null ? void 0 : obj[key]
  }
}