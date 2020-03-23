import React from 'react'
import { RestfulProvider } from "restful-react"
import App, { /*Container*/ /* Container已非预期*/} from 'next/app'
import Head from 'next/head'
import '../styles/spectre.styl'
import '../vant/index.less'
import 'normalize.css/normalize.css'
import { DDYYAPI_BASE_URL } from '@/constant'

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <RestfulProvider  base={DDYYAPI_BASE_URL}>
        <Head>
          <title>next-demo</title>
          <meta charSet='utf-8' />
          <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
        </Head>

        <Component {...pageProps} />

      </RestfulProvider>
    )
  }
}
