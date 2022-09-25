## underscore 组织文件的方式

它使用 `rollup` 去打包文件 整体看起来非常的清爽，使用命令 `bundle` 开始进行打包文件

打包文件大致分为四种

>1. underscore.js 支持 UMD 模块的
>2. underscore.esm.js 支持 ESM 模块的
>3. amd/ 支持 amd 模块
>4. cjs/ 支持 cjs 模块

underscore 源码放置在 `modules` 文件夹下 将每一个功能都抽离为一个函数，每一个函数将其作为 单个模块底层功能(支持underscore运行的功能函数)以`_` 开头命名

除此之外还有三个 `index` 为开头的文件 由这三个决定 其如何打包文件

1、index.js

index.js 文件将所有的功能函数 具名导出 

2、index-default.js

在 index.js 基础上将所有的导出函数以及实例化后的对象全部混合在一起 导出 最后打包生成 underscore.js 文件

3、index-all.js 

在 index-default.js 的基础上导出了一个对象并提供了所有功能函数的接口 最后打包生成 underscore.esm.js 文件

~~~js
// index-all.js
export { default } from './index-default.js';
export * from './index.js';
~~~

这样做的好处是可以选择性导入函数而不是在项目中使用包裹全部的函数，但是最后打包的文件是全部的underscore的代码

这样做有什么好处呢？

> 由于使用到了 ESModule 模块化的管理尽管它将同一个文件下但是它将不同函数(导出函数)当成模块去导出由于都是在同一个模块作用域中所以可以共享其内的变量 也就是说你可以通过这样的调用方式去修改 underscore 内(underscore.esm.js文件内)的变量并且会一直记录下来直到程序结束执行

以上为 underscore 提供了 underscore.js 和 underscore.esm.js 方案 剩余两种 amd/ 和 cjs 呢？

[EsModule详细介绍](https://juejin.cn/post/6844903591979778061)

## 按需加载

在 rollup 配置项中是这样的

~~~js
// ...
var outputBase = {
  strict: false,
  externalLiveBindings: false,
  freeze: false,
} 

// export default []
// ....
{
    input: _.filter(
      glob.sync('modules/**/*.js'),
      function(path) { return path !== 'modules/index-all.js'; }
    ),
    preserveModules: true,
    output: [
      _.extend({
        dir: 'amd',
        format: 'amd',
      }, outputBase),
      _.extend({
        dir: 'cjs',
        format: 'cjs',
      }, outputBase),
    ],
  }
// ....
~~~

这里主要看 `imput ` 和 `output` 这两个配置项 前者去`modules/`中加载文件并且排除 `import-all.js` 文件 这样做的好处是可以生成 `underscore.js`文件的同时也生成 所有功能函数的文件从而能够达到**按需加载** 

这样 **按需加载** 并不是最好的解决方法 当项目多次使用这种方式加载函数 那么必然就会造成相同的代码执行多次的情况，从而造成最后打包的代码体积大，增加了网络的传输 为了解决这个问题要么就大量使用 直接全部加载 或者就少量使用 不过这个问题是在项目中大量使用才造成的结果 【也算是极端情况了】

输出就分为两种模块 分别输出在 `amd` 和 `cjs`中 

参考文章: 

[Introducing Modular Underscore 介绍了 underscore 并且给出了相关问题的解决方法](https://juliangonggrijp.com/article/introducing-modular-underscore.html)

[介绍 esModule 的工作原理](https://juejin.cn/post/6844903591979778061#heading-8)

[]()
