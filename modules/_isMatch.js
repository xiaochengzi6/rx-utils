import keys from "./keys";

export default function isMatch(obj, attrs){
  var _keys = keys(obj), length = _keys.length
  if(object == null) return !length
  var obj = Object(object)
  for(var i = 0; i < length; i++){
    var key = _keys[i]
    if(attrs[key] !== obj[key] || !(key in obj)) return false 
  }
  return true 
}