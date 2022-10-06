function b (_self){
  this = _self 
  console.log(this)
}

function a (){
  var _self = this
  b(_self)
}

console.log(a())