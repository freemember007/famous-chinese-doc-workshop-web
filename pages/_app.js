/**
 * app.js 所有页面的根组件，处理session级的query parmas
 */
// framework
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React/*, { useEffect }*/ from 'react'
import { RestfulProvider } from "restful-react"
// component
import Head from 'next/head'
import { SkeletonTheme } from "react-loading-skeleton"
import '@/styles/spectre.styl'
// config
import { CMS_REST_URL } from '@/config/constant'


const App = ({ Component, pageProps }) => {

  return(
    <RestfulProvider base={CMS_REST_URL}>
      <Head>
        <title>名老中医工作室</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
      </Head>
      <SkeletonTheme color="#eee" highlightColor="#ddd" >
        <Component { ...pageProps } />
      </SkeletonTheme>
    </RestfulProvider>
  )
}

export default App
