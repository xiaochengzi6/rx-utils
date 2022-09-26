import _ from "./root";

export default function chain(obj){
  var instance = new _(obj)
  instance._chain = true 
  return instance
}