import _ from "./root";

/**
 * 这里默认不开启链式调用
 * 
 * 将函数返回的对象 {_wrapped: Value} 处理成被 _ 包裹后的对象在返回
 * 
 * @param {*} instance {_wrapped: Value}
 * @param {*} obj 当前对象
 * @returns 
 */
export default function chainResult(instance, obj){
  return instance._chain ? _(obj).chain() : obj
}