/*
 * babelrc (babel core version: >7.0)
 */

/* ------------------------------------------------------.
| presets 预设 @see: https://babeljs.io/docs/en/presets  |
`------------------------------------------------------*/
const presets = [

  /*
   * @babel/env 对es2015, es2016. es2017的支持
   * @see: https://babeljs.io/docs/en/babel-preset-env
   */
  [
    '@babel/preset-env',
    {
      // polyfill选项，必须配合设定corejs版本
      // yarn add core-js@3
      // 注：babel7下plugin-transform-runtime下的polyfill选项已移除
      // @see: https://babeljs.io/docs/en/babel-preset-env#usebuiltins
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },

      // targets: {
      //   // 仅支持支持es模块的浏览器，千万不要用true，否则会导致很多node_modules包在低端浏览器出错
      //   esmodules: false
      // },

      // exclude: ['@babel/plugin-transform-regenerator'], //排除那些插件

      modules: 'commonjs', // 不可为false，否则import不会转，node环境会出错
    },
  ],

  /*
   * @babel/preset-react 对react/jsx支持
   * @see: https://babeljs.io/docs/en/babel-preset-react
   */
  // ["next/babel"],
  [
    '@babel/preset-react',
    {
      development: process.env.BABEL_ENV === 'development',
    },
  ],
]

/* ------------------------------------------------------.
| plugins 插件 @see: https://babeljs.io/docs/en/plugins  |
`------------------------------------------------------*/
const plugins = [
  // // 允许使用x-if x-show x-for x-model-hook x-class等类vue指令
  // // @see: https://github.com/peakchen90/babel-plugin-react-directives
  'react-directives',

  // 对pug模板的支持
  // @see: https://github.com/pugjs/babel-plugin-transform-react-pug
  'transform-react-pug',

  // 对浏览器低版本的支持
  // @see: https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav
  [
    '@babel/plugin-transform-runtime',
    {
      absoluteRuntime: false, // 没事别改true

      // polyfill相关
      // yarn add @babel/runtime
      // 与preset-env中的corejs有何关系？
      corejs: { version: 3, proposals: true },

      helpers: true,
      regenerator: true,
      useESModules: false, // 没事别改true
    },
  ],

  // 相对于根目录@输入
  [
    'babel-plugin-root-import',
    {
      rootPathSuffix : './',
      rootPathPrefix : '@/', // 斜杠不可少,否则会导致以@开头的包出问题
    }
  ],


  /*
   * antd等UI组件按需引入
   * @see:https://ant.design/docs/react/getting-started-cn#按需加载
   */
  [
    'import',
    {
      libraryName: 'antd-mobile',
      libraryDirectory: 'lib',
      style: true,
    },
    'antd-mobile',
  ],

  /*
   * styled-components支持
   * @see: https://github.com/styled-components/styled-components
   * @bug: 第三方库使用了styled-components时，ssr不成功，相关issure: https://github.com/styled-components/babel-plugin-styled-components/issues/149
   */
  ['styled-components', {
    ssr      : false, // 如不支持ssr，避免sum比对的警告（目前不知什么原因使用了该插件并不能实现ssr，故先关闭）
    fileName : false, // 不显示styledComponents所在的文件名(如sementic-tags___title => _title)
  }],

  //  * styled-jsx支持，及styled-jsx-stylus
  //  * @see: https://github.com/zeit/styled-jsx
  //  * @see: https://github.com/omardelarosa/styled-jsx-plugin-stylus
  ['styled-jsx/babel', { plugins: ['styled-jsx-plugin-stylus'] }],

  // /*
  //  * 用于import()惰性加载组件
  //  * @see: https://babeljs.io/docs/plugins/syntax-dynamic-import/
  //  */
  // '@babel/plugin-syntax-dynamic-import',

  // /*
  //  * 支持classProperties和对象解析语法(很多第三方的基于class的库会用到)
  //  * 可能跟预设/polyfill有重复，不管，多加点总不会错
  //  */
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  // '@babel/plugin-transform-object-assign',
  // // Object.entries & Object.values polyfill
  // 'transform-es2017-object-entries',

  // // 尝试解决打包时使用严格模式问题，貌似无效
  // 'transform-remove-strict-mode',

  // // 按需加载lodash/ramda/...
  // // @see: https://www.npmjs.com/package/babel-plugin-lodash
  // // @see: https://github.com/megawac/babel-plugin-ramda
  // 'lodash',
  // 'ramda',
  // 'date-fns',

  // log插件1: log文件名，变量名，文件名长度可自定义，async下存在多次log的情况
  // @see: https://github.com/peteringram0/babel-plugin-console-source
  // ['babel-plugin-console-source', { 'segments': 1 }],
  // log插件2: log函数名
  // 'annotate-console-log',
  // log插件3: log文件名，函数名，变量名，缺点：文件名长度不可自定义
  // @see: https://github.com/kwelch/babel-plugin-captains-log
  ["babel-plugin-captains-log", { "injectFileName": true, "injectVariableName": true, "injectScope": true }],


  // // ---- tc39提案
  // // @see: https://github.com/babel/proposals

  // // 可选链式调用(.?操作符)
  // // @see: https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining
  '@babel/plugin-proposal-optional-chaining',

  // // 管道操作符(|>)
  // // @see: https://babeljs.io/docs/en/next/babel-plugin-proposal-pipeline-operator
  ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],

  // // 函数部分应用
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-partial-application
  // '@babel/plugin-proposal-partial-application',

  // // throw表达式
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-throw-expressions
  '@babel/plugin-proposal-throw-expressions',

  // // export foo from bar
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
  // '@babel/plugin-proposal-export-default-from',

  // // 函数绑定(::操作符)
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-function-bind
  '@babel/plugin-proposal-function-bind',

  // // do表达式
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-do-expressions
  // '@babel/plugin-proposal-do-expressions',

  // // for await (const i of someAsyncActionResult)
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-async-generator-functions
  // '@babel/plugin-proposal-async-generator-functions',

  // // 可选catch绑定
  // // @see: https://babeljs.io/docs/en/babel-plugin-proposal-optional-catch-binding
  // '@babel/plugin-proposal-optional-catch-binding',

  // 严格默认值(??操作符)
  // @see: https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator
  '@babel/plugin-proposal-nullish-coalescing-operator',

  // 逻辑赋值语句（&&=, ||=)
  '@babel/plugin-proposal-logical-assignment-operators',

  // // ---- 其他

  // 宏支持，方便使用param.macro提供的类似Kotlin's it lambda模式
  'macros',

  // 使用 & 操作符进行函数组合
  // @see: https://github.com/haskellcamargo/babel-plugin-function-composition
  'function-composition',

  // // 数字 + - * / 自动清除浮动
  // 'arithmetic', // build时报minify错误, 类似的还有pampy

]

const parserOpts = {
  allowReturnOutsideFunction: true, // 全局return, 方便test
  // allowAwaitOutsideFunction: true, // 全局await, 无效
}

module.exports = { presets, plugins, parserOpts }
