// import { push } from "./_setUp";
var push = Array.prototype.push

demo(1,2,3,4,5)
function demo(){
  var args = []
  push.apply(args, arguments)
  console.log(args)
}