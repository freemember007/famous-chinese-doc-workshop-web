/*
 * Header
 */
import React from 'react'
import MainContainer from '@/components/MainContainer'
import Nav from '@/components/Nav'


// import Logo from 'svg-react-loader!../svgs/logo.svg'

const TopHint = () => {
  return pug`
    MainContainer(background="dark")
      div.py2.f4 您好，欢迎来到杭州市名中医工作室！
  `
}

const Logo = () => pug`
  img(src="logo.png")
  //- section
    div.primary(style={ fontSize: '36px' }) 王永均名老中医工作室
    div.gray.f2 杭州市中医院
`

const Search = () => pug`
  div
    input.p2.form-input(style={ /*borderRadius: '10px'*/ }, type="text",placeholder="搜索")
`

const LogoAndSearch = () => {
  return pug`
    //- MainContainer(background="primary")
    MainContainer
      div.py6.__flex.j-between
        Logo
        Search
  `
}

const Header = () => {
  return pug`
    TopHint
    LogoAndSearch
    Nav
  `
}

export default Header
