import _ from '../rx-node.mjs'

const target = {
  field1: 1,
  field2: undefined,
  field3: {
      child: 'child'
  },
  field4: [2, 4, 8],
  empty: null,
  map: new Map(),
  set: new Set(),
};

const a = _.deepClone(target)
console.log(a)
