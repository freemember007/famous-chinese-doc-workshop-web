/*
 * Header
 */
import React from 'react'
import { List, Item } from '@/components/tagName'
import MainContainer from '@/components/MainContainer'

const Nav = () => {
  return <>
    <MainContainer background="primary">
      <List className="py2 __flex j-left">
        <Item className="mr8 white" x-for={num in [1, 2, 3, 4, 5]} key={num}>
          名医风采
        </Item>
      </List>
    </MainContainer>
  </>
}

export default Nav
