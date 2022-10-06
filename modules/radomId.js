export default function radomId(){
  // todo 获取传入的参数生成 md5 或者是一些其他的东西

  // 生成 10 位随机数
  var id = Math.random().toString(32).slice(2)
  return id 
}