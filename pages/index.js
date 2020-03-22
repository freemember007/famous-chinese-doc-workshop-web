// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { inc } from 'ramda'
import { Button as Abutton } from 'antd-mobile'
// import { matchPairs, ANY } from 'pampy'
// import { it, _ } from 'param.macro'
import { VueWrapper } from 'vuera'
// import Navbar from '../components/Navbar'
// import Modal from '../components/Modal'
import Button from '../vant/button'
import Dialog from '../vant/dialog'
import NavBar from '../vant/nav-bar'
// import Field from 'vant/lib/field' // 原为1.6，现升级2.5，应有各种问题

// main
function Main(/*props*/) {

  // const aaa = 1 |> inc(11, _) |> console.log
  const loaded = 1 |> inc |> console.log
  console.log([1,2,3]?.[0])

  return pug`
    VueWrapper(component=NavBar title="首页" left-text="返回" left-arrow="" @click-left="onClickLeft" @click-right="onClickRight")
    each i,index in [1,2,3, 4, 5, 1, 7, 8]
      p(key=index) 第#{i}
      div

    if !loaded
      Abutton(type="primary") aaa

    else
      div.pt2

    VueWrapper(component=Button,type="primary") I'm Vant!
    div
      button.btn Click Me!
  `
}

export default Main
