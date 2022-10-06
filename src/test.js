function _flatten (array, deep, strict){
  console.log(array, deep, strict)
}

function flatten(array, deep){
  return _flatten(array, deep, false)
}
flatten()