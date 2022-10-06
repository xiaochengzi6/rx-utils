import getLength from "./_getLength"
import isArrayLink from "./_isArrayLink"
import isArray from "./isArray"
import isArguments from "./isArguments"

/**
 * 数组扁平化处理
 * 
 * @param {Array} input 输入的数组
 * @param {Boolean} shallow 是否浅拷贝
 * @param {Boolean} strict 是否严格模式 严格模式开启时 只会打平 array 类型其余类型全部过滤
 * @param {Array} output 输出的数组
 */
export default function flatten(input, shallow, strict, output){
  output = output || []
  var idx = output.length
  for(var i = 0, length = getLength(input); i < length; i++){
    var value = input[i]
    // 确保是数组或者是类数组
    if(isArrayLink(input) && (isArray(input) || isArguments(input))){
      if(shallow){
        var j = 0, len = value.length
        while(j < len) output[idx++] = value[j++]
      }else{
        flatten(value, shallow, strict, output)
        idx = output.length 
      }
    }else if(!strict){
      output[idx++] = value 
    }
  }
  return output
}
