/*
 * Header
 */
import React from 'react'
import { FullWidthContainer, MainContainer, List, Item } from '@/components/tagName'
// import Logo from 'svg-react-loader!../svgs/logo.svg'

const Nav = () => {
  return pug`
    FullWidthContainer.py3.vw12.bg-primary.__flex.j-center
      MainContainer.w8
        List.__flex.j-left
          Item.mr8.white 名医风采
          Item.mr8.white 名医风采
          Item.mr8.white 名医风采
          Item.mr8.white 名医风采
          Item.mr8.white 名医风采
  `
}

export default Nav
