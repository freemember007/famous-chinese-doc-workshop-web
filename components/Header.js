/*
 * Header
 */
import React from 'react'
import MainContainer from '@/components/MainContainer'
import Nav from '@/components/Nav'
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

const Header = ({ hosName, hosLogo}) => {
  return <>
    <TopHint {...{ hosName } } />
    <MainContainer>
      <div className="py6 __flex j-between">
        <Logo {...{ hosLogo }} />
        <Search />
      </div>
    </MainContainer>
    <Nav />
  </>
}

export default Header
