import { MAX_ARRAY_INDEX } from "./_setUp"

export default function isArrayLink(obj){
  var length = obj.length
  if(obj && typeof length === 'number' && length >= 0 && length < MAX_ARRAY_INDEX){
    return true
  }
  return false
}