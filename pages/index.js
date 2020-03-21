// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { inc } from 'ramda'
// import { matchPairs, ANY } from 'pampy'
// import { it, _ } from 'param.macro'

// main
function Main(/*props*/) {

  // const aaa = 1 |> inc(11, _) |> console.log
  const loaded = 1 |> inc |> console.log
  console.log([1,2,3]?.[0])

  return pug`
    each i,index in [1,2,3]
      div(key=index) 第#{i}
      div

    if !loaded
      div.aaa.bbb(autoFocus="autoFocus")

    else
      div.pt2
  `
}

export default Main
