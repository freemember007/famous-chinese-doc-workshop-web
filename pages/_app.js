import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React from 'react'
import { RestfulProvider } from "restful-react"
import App, { /*Container*/ /* Container已非预期*/} from 'next/app'
import Head from 'next/head'
import '@/styles/spectre.styl'
import "@/node_modules/placeholder-loading/dist/css/placeholder-loading.min.css"
import { DDYYAPI_BASE_URL } from '@/constant'
import { SkeletonTheme } from "react-loading-skeleton"


class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return pug`
      RestfulProvider(base=DDYYAPI_BASE_URL)
        Head
          title 点点医院量表问卷系统
          meta(charSet="utf-8")
          meta(name="viewport", content="width=device-width,initial-scale=1,user-scalable=0")
        SkeletonTheme(color="#eee",highlightColor="#ddd")
          Component(...pageProps)
    `
  }
}

export default (MyApp)
