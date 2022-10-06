/**
 * 去重数组
 * @param {Array} array 
 * @param {Boolean} isSorted 是否排序
 * @return 返回一个去重后的数组
 */
 function unique(array, isSorted, iteratee){
  var res = []
  var seen = []

  for(var i = 0, len = array.length; i < len; i++){
    var value = array[i]
    var computed = iteratee ? iteratee(array[i], i, array) : value 
    if(isSorted){
      if(!i || seen !== computed){
        res.push(computed)
      }
      seen = computed
    }else if(iteratee){
      if(seen.indexOf(computed)){
        seen.push(computed)
        res.push(computed)
      }
    }else if(res.indexOf(value) === -1){
      res.push(value)
    }
  }
  return res 
}