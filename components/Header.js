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
  <img src={hosLogo} />

const Search = () =>
  <div>
    <input className="p2 form-input" type="text" placeholder="搜索"/>
  </div>

const Nav = () =>
  <MainContainer background="primary">
    <List className="py2 __flex j-left">
      <Item className="mr8 white" x-for={num in [1, 2, 3, 4, 5]} key={num}>
        名医风采
      </Item>
    </List>
  </MainContainer>

const Header = ({ hosName, hosLogo}) => {
  return <>
    <TopHint {...{ hosName } } />
    <MainContainer>
      <div className="py6 __flex j-between">
        <Logo {...{ hosLogo }} />
        <Search />
      </div>
    </MainContainer>
    <Nav/>
  </>
}

export default Header
