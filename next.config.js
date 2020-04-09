/**
 * next配置
 * @notice: 此文件修改后需重新编译运行
 */
// stylus相关
const withCss      = require('@zeit/next-css')
const withLess     = require('@zeit/next-less')
const withStylus   = require('@zeit/next-stylus')
const autoprefixer = require('autoprefixer')
const poststylus   = require('poststylus')
// 插件/补丁...
const withPlugins = require("next-compose-plugins")
const lessToJS    = require('less-vars-to-js')
const fs          = require('fs')
const path        = require('path')
// env
const IS_DEV = process.env.NODE_ENV !== 'production'
// // webpack插件
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (/*file*/) => {}
}

// 需要被next-babel-loader处理，避免被exclude
// @see: https://www.cnblogs.com/1wen/p/10793868.html
// @see: https://github.com/martpie/next-transpile-modules
const withTM = require('next-transpile-modules')([
  'antd-mobile',
])

module.exports = withPlugins([ withCss, withStylus, withLess, withTM],{

  /*
   * css相关
   * 请勿引入css-module, 因有很多兼容问题, 另我们也并不需要
   * 不必配置postcssLoaderOptions, 因我们仅用其基础的autoprefixer
   */

  // stylusLoader选项
  stylusLoaderOptions: {
    use: [
      poststylus([ //stylus专用的postcss插件(不用也行,因有全局postcss),好处是会带编译警告
        autoprefixer({ flexbox: 'no-2009' }),
      ]),
    ],
  },

  // 解决antd-mobile less加载报错
  transpileModules: ["antd-mobile"],

  // lessLoader选项
  lessLoaderOptions: {
    javascriptEnabled: true,
    // antd-mobile主题替换
    modifyVars: lessToJS(
      fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
    ),
  },


  /**
   * webpack相关
   */
  webpack: (config /*{ buildId, dev, isServer, defaultLoaders }*/) => {

    // 查看next默认的js/mjs/jsx文件rule
    // console.log(config.module.rules[0].use.options)
    // require('shelljs').exec(`echo ${_rules} > rules.json`)

    // config.module.rules.push(
    // config.module.rules.push(

    // 覆盖next默认的js/mjs/jsx文件loader(next-babel-loader)
    // @see: node_modules/next/dist/build/webpack/loaders/next-babel-loader.js

    // {
    //   test: /\.(tsx|ts|js|mjs|jsx)$/,
    //   include: [
    //     path.resolve(__dirname),
    //     /next[\\/]dist[\\/]next-server[\\/]lib/,
    //     /next[\\/]dist[\\/]client/,
    //     /next[\\/]dist[\\/]pages/,
    //     // /node_modules[\\/](antd-mobile)/,
    //     /[\\/](strip-ansi|ansi-regex)[\\/]/
    //   ],
    //   exclude: /node_modules\/(?!(antd-mobile))/,
    //   use: {
    //     loader: 'next-babel-loader',
    //     options: {
    //       isServer: false,
    //       distDir: path.resolve(__dirname, '.next'),
    //       pagesDir: path.resolve(__dirname, 'pages'),
    //       cwd: path.resolve(__dirname),
    //       cache: true,
    //       babelPresetPlugins: [],
    //       hasModern: false,
    //       development: IS_DEV
    //     }
    //   }
    // },

    // {
    //   test: /\.(js|mjs|jsx)$/,
    //   include:
    //     [ path.resolve(__dirname),
    //       /next-server\/dist\/lib/, //next自己写的打包用的
    //     ],
    //   // 有些包直接使用ES6语法，需要转一下，否则低版本浏览器报错
    //   exclude: /node_modules/,
    //   // exclude: /node_modules\/(?!(antd-mobile))/,
    //   use:
    //   {
    //     loader: 'babel-loader',
    //   }
    // },
    // {
    //   test: /\.css$/,
    //   use: [ "css-loader",{
    //     options: {
    //       includePaths: ['./node_modules/normalize.css']
    //     }
    //   }]
    // }
    // )

    // config.plugins.push(
    //   // 在babel按需引入的基础上进一步通过语义分析最小化loadash
    //   new LodashModuleReplacementPlugin,
    // )


    return config

  },


  /**
   * webpack中间件相关
   */
  webpackDevMiddleware: config => {

    return config

  },


  /**
   * 生产环境与部署相关
   */
  publicRuntimeConfig: {
    staticFolder: '/static',
    IS_DEV,
  },

  // env: {
  //   SERVER_HOST: 'https://sites.diandianys.com/wechat/book-home/'
  // },

  // 定义生产环境下页面路由的根路径，重要，否则nginx location反向代理会不成功
  assetPrefix: './',

  // // bundleAnalyzer 打包尺寸可视化分析，仅yarn build时
  // // @see: https://cnpmjs.org/package/webpack-bundle-analyzer
  // analyzeBrowser: ['browser', 'both'].includes('both'),
  // bundleAnalyzerConfig: {
  //   browser: {
  //     analyzerMode: 'static',
  //     reportFilename: '../.next/bundles/client.html',
  //   },
  // },

})
