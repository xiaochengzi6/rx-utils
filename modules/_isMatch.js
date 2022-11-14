import keys from "./keys";

/**
 * 判断目标对象 obj 中的属性有没有 attrs 对象
 * 例如: [{name:'Kevin'}, {name: 'Daisy', age: 18}], {name: 'Daisy'} ==> [false, true]
 * 
 * @param {*} obj 目标对象
 * @param {*} attrs 传入的对象
 * @returns boolean 
 */
export default function isMatch(obj, attrs){
  var _keys = keys(obj), length = _keys.length

  if(obj == null) return !length

  var _obj = Object(obj)
  for(var i = 0; i < length; i++){
    var key = _keys[i]
    if(attrs[key] !== _obj[key] || !(key in _obj)) return false 
  }
  return true 
}