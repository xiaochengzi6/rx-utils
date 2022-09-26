
import _ from './root'
import each from './each'
import { push } from './_setUp'
import functions from './functions'

/**
 * 将对象的所有方法混合到 _ 对象的原型上
 * @param {*} obj 
 */
export default function mixin(obj){
  each(functions(obj), function (name){
    var func = _[name] = obj[name]
    _.prototype[name] = function(){
      var args = [this._wrapped]
      push.apply(args, arguments)

    }
  })
}