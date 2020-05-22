/*
 * Header
 */
import React from 'react'
import { List, Item } from '@/components/tagName'
import MainContainer from '@/components/MainContainer'

const Nav = () => {
  return pug`
    MainContainer(background="primary")
      List.py2.__flex.j-left
        Item.mr8.white 名医风采
        Item.mr8.white 名医风采
        Item.mr8.white 名医风采
        Item.mr8.white 名医风采
        Item.mr8.white 名医风采
  `
}

export default Nav
