import getType from "./getType"
import cloneFunction from "./_cloneFunction"
import cloneSymbol from "./_cloneSymbol"
import cloneReg from "./_cloneREG"

export default function cloneOtherType(target, type){
  if(typeof target === 'undefined' || type === undefined) return void 0
  
  if(target === null) return null 

  if(type == null){
    type = getType(target)
  }

  // 虽然可以修改普通类型的 constructor 但是再去获取也是被Boolean 包装后的所以不必太担心
  var Ctor  = target['constructor']
  
  switch (type) {
    case 'Number':
    case 'String':
    case 'Boolean':
    case 'Error':
    case 'number':
    case 'Date':
      return new Ctor(target) 
    case 'RegExp':
      return cloneReg(target)
    case 'Symbol':
      return cloneSymbol(target)
    case 'Function':
      return cloneFunction(target)
    default:
      return null 
  }
}