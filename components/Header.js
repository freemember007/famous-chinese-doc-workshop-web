/*
 * Header
 */
import React from 'react'
import MainContainer from '@/components/MainContainer'

// import Logo from 'svg-react-loader!../svgs/logo.svg'

const TopHint = () => {
  return pug`
    MainContainer(background="dark")
      div.f4 您好，欢迎来到杭州市名中医工作室！
  `
}

const Logo = () => pug`
  img(src="logo.png")
`

const Search = () => pug`
  div
    input.p2.form-input(style={ /*borderRadius: '10px'*/ }, type="text",placeholder="搜索")
`

const LogoAndSearch = () => {
  return pug`
    MainContainer
      div.__flex.j-between
        Logo
        Search
  `
}

const Header = () => {
  return pug`
    TopHint
    LogoAndSearch
  `
}

export default Header
