import isObject from "./isObject";
import { nativeKeys } from "./_setUp";

export default function allKeys(obj){
  if(!isObject) return []
  if(nativeKeys) return nativeKeys
  var keys = []
  for(var key in obj) keys.push(key)

  return keys 
}