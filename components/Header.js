/*
 * Header
 */
import React from 'react'
import { FullWidthContainer, MainContainer, Left, Right } from '@/components/_tags'
// import Logo from 'svg-react-loader!../svgs/logo.svg'

const TopHint = () => {
  return pug`
    FullWidthContainer.py2.vw12.bg-dark.__flex.j-center
      MainContainer.w8.__flex.j-left
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
    FullWidthContainer.py2.vw12.__flex.j-center
      MainContainer.py4.w8.__flex.j-between
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
