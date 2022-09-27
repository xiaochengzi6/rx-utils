(function() {

  var root = (typeof self == 'object' && self.self == self && self) ||
      (typeof global == 'object' && global.global == global && global) ||
      this || {};

  var ArrayProto = Array.prototype;

  var push = ArrayProto.push;

  var _ = function(obj) {
      if (obj instanceof _) {
        return obj
      }
      if (!(this instanceof _)){
        return new _(obj)
      }
      this._wrapped = obj;
  };

  if (typeof exports != 'undefined' && !exports.nodeType) {
      if (typeof module != 'undefined' && !module.nodeType && module.exports) {
          exports = module.exports = _;
      }
      exports._ = _;
  } else {
      root._ = _;
  }

  _.VERSION = '0.2';

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  var isArrayLike = function(collection) {
      var length = collection.length;
      return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  _.each = function(obj, callback) {
      var length, i = 0;

      if (isArrayLike(obj)) {
          length = obj.length;
          for (; i < length; i++) {
              if (callback.call(obj[i], obj[i], i) === false) {
                  break;
              }
          }
      } else {
          for (i in obj) {
              if (callback.call(obj[i], obj[i], i) === false) {
                  break;
              }
          }
      }

      return obj;
  }

  

  _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
  };

  _.functions = function(obj) {
      var names = [];
      for (var key in obj) {
          if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
  };

  /**
   * 在 _.mixin(_) 前添加自己定义的方法
   */
  _.reverse = function(string){
      return string.split('').reverse().join('');
  }

  

  

  _.each(['push'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj, 'value');
    };
  });

_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
        };
    });
    return _;
};

  _.mixin(_);

  var chainResult = function(instance, obj) {
    // console.log('obj', obj)
      return instance._chain ? _(obj).chain() : obj;
  };
  _.chain = function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
  //   console.log(' \n instance', instance, obj)
    return instance;
};
  _.prototype.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
  //   console.log(' \n instance', instance, obj)
    return instance;
};

  _.prototype.value = function () {
      return this._wrapped;
  };

  var arr = _.chain([1, 2, 3]).push(1);
  console.log(arr)
})()

/**
 * 链式调用这一块主要看 push 如何处理的 不着急
 */

