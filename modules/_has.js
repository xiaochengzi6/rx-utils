import { hasOwnProperty } from "./_setUp"

// 处理 key 是否是 obj 的属性
export default function has(obj, key){
  return obj != null && hasOwnProperty.call(obj, key)
}