# Rx-utils

js 的工具库

## 介绍

`rx-file` 主要继承于 [`underscore`](https://github.com/jashkenas/underscore/) 毕竟作者会动不动的去抄`underscore`的代码 `underscore` 它是非常成功 内置了很多的功能函数和底层函数 `rx-file` 要做的就是继承而后独立于的这个过程 去内置更多的更有意思的函数

## 打包文件

`RXutils.js` umd 格式文件

`RXutils.esm.js` esm 格式文件

`Rx-node-f.js` esm 格式文件 父版本 子文件（两个文件） `Rx-node-cjs.js` 和 `Rx-node-mjs.js` 文件 两者都在Node 环境下使用但是 后者将 esm 模式应用在 node 环境中

`rx-node-c-f.cjs` 和 `rx-node-c.cjs` 是由 `Rx-node-f.js` 和 `Rx-node-cjs.js` 生成 cjs模式 用于 node 环境

最后再由 `Rx-node-cjs.js` 去生成一个 mjs 的文件 里面涉及到的链接将使用 `rx-node-c-f.cjs`去引用然后生成 `rx-node.mjs` 用于 node 环境使用 esm 模式


最终文件可用的有

~~~txt
RXutils.js 
RXutils.esm.js


Rx-node-f.js
这两个主要做了中转的过程
Rx-node-cjs.js  
Rx-node-mjs.js

rx-node-c-f.cjs
rx-node-c.cjs
rx-node.mjs
~~~

## 规划 

1. 完成 js 工具库大部分常见功能

2. 使用 Ts 重构

3. 使用 rollup 打包

4. 后续 ...(优化)
