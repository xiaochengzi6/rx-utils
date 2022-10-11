import getType from "./getType"
import cloneFunction from "./_cloneFunction"
import cloneSymbol from "./_cloneSymbol"
import cloneReg from "./_cloneReg"

export default function cloneOtherType(target, type){
  if(typeof target === 'undefined' || type === undefined) return void 0
  
  if(target === null) return null 

  if(type == null){
    type = getType(target)
  }

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