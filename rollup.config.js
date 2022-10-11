import glob from 'glob'

var outputBase = {
  strict: false,
  externalLiveBindings: false,
  freeze: false
}

var sourcemapBase = {
  sourcemap: true,
  sourcemapExcludeSources: true
}

export function outputConf(particular) {
  return Object.assign({}, particular, outputBase)
}

export function monolithConf(particular) {
  return Object.assign({}, particular, outputBase, sourcemapBase)
}

function filter() {
  var files = glob.sync('modules/**/*.js')
  return files.filter((path) => path !== 'modules/index-all.js')
}

export default [
  // umd 格式
  {
    input: './modules/index-default.js',
    treeshake: false /*关闭摇树优化*/,
    output: {
      file: 'RXutils.js',
      format: 'umd',
      name: '_',
      amd: {
        id: 're-file'
      }
    }
  },
  // esm 格式
  {
    input: './modules/index-all.js',
    treeshake: false,
    output: monolithConf({
      file: 'RXutils.esm.js',
      format: 'esm'
    })
  },
  // 按需加载
  {
    input: filter(),
    //preserveModules: https://rollupjs.org/guide/en/#outputpreservemodules
    preserveModules: true /*使用原始模块名称作为文件名为所有模块创建单独的块*/,
    output: [
      outputConf({
        dir: 'amd',
        export: 'auto',
        format: 'amd'
      }),
      outputConf({
        dir: 'cjs',
        export: 'auto',
        format: 'cjs'
      })
    ]
  },
  // 这里生成 node 端的版本 但并不是最终版这里还需要再转化一下
  {
    input: {
      'RX-node-cjs': 'modules/index-default.js',
      'RX-node-mjs': 'modules/index-all.js'
    },
    treeshake: false,
    output: monolithConf({
      chunkFileNames: 'RX-node-f.js',
      dir: '.',
      minifyInternalExports: false,
      format: 'esm'
    })
  }
]
