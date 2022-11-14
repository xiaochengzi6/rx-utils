const flattenObj = require('../cjs/flattenObj')


console.log(flattenObj)

// ==============测试===============
var mock_a = {
  a: 1,
  b: 2,
  c: {
    d: 'd'
  },
  e: [1,2,3]
}

var a = flattenObj(mock_a, function (value, key, obj) {
  console.log(`value: ${value}, key: ${key}, obj: ${obj}`)
})

console.log('a',a)

