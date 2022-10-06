/**
 * 数组去重
 * 
 * 双层循环的方式 
 * 
 * 优点：兼容性好
 * 
 * @param {*} array 数组 
 * @returns 返回去重后的数组
 */
function unique(array){
  var res = [], resLen
  for(var i = 0; i < array.length; i++){
    for(var j = 0, resLen = res.length; j < resLen; j++){
      if(arr[i] === res[j]){
        break
      }
    }
    // 如果当前的 j === resLen 那么就说明循环结束了且没有一样的值可以添加
    // 如果有相同的值但是会被跳出这次循环就不会使其 j 发生改变
    // [这里的改变是指不会和resLen相同所以就不会添加就跳过了--》去重]
    if(j === resLen){
      res.push(arr[i])
    }
  }
  return res 
}

/**
 * 去重数组 
 * 
 * 使用 es6 中语法
 * 
 * @param {*} array 
 * @returns 返回去重后的数组 
 */
function unique(array){
  const res = []
  for(let i = 0; i < array.length; i++){
    if(res.indexOf(array[i]) === -1){
      res.push(array[i])
    }
  }
  return res 
}

/**
 * 去重数组 
 * 
 * 方法：现排序再对比前后两者是否相同, 比上一个方法的速度更快
 * 
 * @param {Array} array
 * @returns 返回一个去重后的数组
 */
function unique(array){
  const _array = array.concat().sort()
  let lastValue
  const res = []
  for(let i = 0; i < _array.length; i++){
    // 如果是第一次，或者前后对比相同那么就会 去重
    if(!i || lastValue !== _array[i]){
      res.push(_array[i])
    }
    lastValue = _array[i] 
  }
  return res 
}


/**
 * 去重数组          
 * 
 * 通过判断是否排序来确定使用什么方式
 * 
 * @param {Array} array 数组  
 * @param {Boolean} isSorted 是否排序
 */
function unique(array, isSorted){
  const res = []
  let lastValue

  for(let i = 0; i < array.length; i++){
    if(!isSorted){
      if(res.indexOf(array[i]) === -1){
        res.push(array[i])
      }
    }else{
      if(!i || lastValue !== array[i]){
        res.push(array[i])
      }
      lastValue = array[i]
    }
  }
  return res 
}


/**
 * 去重数组
 * 
 * 优化：使其能够判断 'a' == 'A' 的时候是 true 并向下兼容
 * 
 * 这里添加了一个回调函数可以对原来的值添加规则
 * 
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