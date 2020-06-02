/*
 * Header
 */
import React from 'react'
import MainContainer from '@/components/MainContainer'
import { List, Item } from '@/components/tagName'
// import Logo from 'svg-react-loader!../svgs/logo.svg'

const TopHint = ({ hosName }) => {
  return <>
    <MainContainer background="dark">
      <div className="py2 f4">
        您好，欢迎来到{hosName}
      </div>
    </MainContainer>
  </>
}

const Logo = ({ hosLogo }) =>
  <img src={hosLogo} className="w6-sm"/>

const Search = () =>
  <div>
    <input className="p2 form-input hide-sm" type="text" placeholder="搜索"/>
  </div>

const Nav = ({ navMenus }) =>
  <section className="hide-sm">
    <MainContainer background="primary">
      <List className="py2 __flex j-left">
        <Item className="mr8 white" x-for={navMenu in navMenus} key={navMenu.id}>
          {navMenu.name}
        </Item>
      </List>
    </MainContainer>
  </section>

const Header = ({ hosName, hosLogo, navMenus }) => {
  return <>
    <TopHint {...{ hosName } } />
    <MainContainer>
      <div className="py6 __flex j-between">
        <Logo {...{ hosLogo }} />
        <Search />
      </div>
    </MainContainer>
    <Nav {...{ navMenus }}/>
  </>
}

export default Header
