import { toString } from "./_setUp";

export default function tagTester(name){
  var tag = '[object ' + name + ']'

  return function(obj){
    return toString.call(obj) === tag
  }
}