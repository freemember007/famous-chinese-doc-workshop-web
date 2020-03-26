// require('babel-polyfill')
// require('es6-promise').polyfill()
// import 'whatwg-fetch'
// import 'abortcontroller-polyfill'
import React from 'react'
import { RestfulProvider } from "restful-react"
import App, { /*Container*/ /* Container已非预期*/} from 'next/app'
import Head from 'next/head'
import '@/styles/spectre.styl'
import { DDYYAPI_BASE_URL } from '@/constant'

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    console.log({pageProps})
    return pug`
      RestfulProvider(base=DDYYAPI_BASE_URL)
        Head
          title next-demo
          meta(charSet="utf-8")
          meta(name="viewport", content="width=device-width,initial-scale=1,user-scalable=0")
        Component(...pageProps)
    `
  }
}

export default (MyApp)
