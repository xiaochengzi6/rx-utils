export default function optimizeCb(func, context, argCount){
  if(context === void 0) return func 
  
  // 使用 call 的性能比使用 apply 的要好
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function(value){
        return func.call(context, value)
      }
    case 2:
      return function(value, index){
        return func.call(context, value, index)
      }
    case 3:
      return function (value, index, args){
        return func.call(context, value, index, args)
      }
    // 例如 redux
    case 4:
      return function (preValue, value, index, args){
        return func.call(context, preValue, value, index, args)
      } 
  }
  
  
  // 剩余情况
  return function (){
    return func.apply(context, arguments)
  }
}