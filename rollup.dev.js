import { monolithConf } from './rollup.config'
import { resolve } from 'path'

var sharedInput = './RX-node-f.js'
var sharedOutput = 'rx-node-c-f.cjs'

export default [
  // 生成 mjs 文件
  {
    input: './RX-node-mjs.js',
    external: sharedInput,
    output: monolithConf({
      file: 'rx-node.mjs',
      format: 'esm',
      // 当遇到请求 sharedInput 链接的时候就直接导入 sharedOutput 处的代码
      paths: {
        [resolve(__dirname, sharedInput)]: sharedOutput,
      },
    }),
  },
  // 生成 cjs 文件
  {
    input: {
      'rx-node-c-f': sharedInput,
      'rx-node-c': './RX-node-cjs.js'
    },
    treeshake: false,
    output: {
      entryFileNames: '[name].cjs',
      dir: '.',
      format: 'cjs',
      exports: 'auto'
    }
  }
]