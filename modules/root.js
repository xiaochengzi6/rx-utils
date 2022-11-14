import { VERSION } from './_setUp'

export default function _() {
  var _ = function (obj) {
    if (obj instanceof _) return obj
    if (!(this instanceof _)) return new _(obj)
    this._wrapped = obj
  }
}

_.version = VERSION

// 返回最终结果
_.prototype.value = function () {
  return this._wrapped
}

_.prototype.valueOf = _.prototype.toJson = _.prototype.value

_.prototype.toString = function() {
  return String(this._wrapped)
}
