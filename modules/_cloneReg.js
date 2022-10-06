/**
 * 克隆正则
 * 内部函数 确保 reg 是正则才行
 * @param {*} reg 
 * @returns {*} 返回值正则类型 
 */
export default function cloneReg(reg){
  // 找到正则尾后的字母
  var reFlags = /\w*$/
  var result = new RegExp(reg.source, reFlags.exec(reg))
  result.lastIndex = reg.lastIndex
  return result
}
