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

function outputConf(particular) {
  return Object.assign({}, particular, outputBase)
}

function monolithConf(particular) {
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
      file: 'rx-file.js',
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
      file: 'rx-file.esm.js',
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
  }
]
