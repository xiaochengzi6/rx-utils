import {toString} from './_setUp'

export default function getType(target){
  var value = toString.call(target).slice(8, -1)
  return value 
}