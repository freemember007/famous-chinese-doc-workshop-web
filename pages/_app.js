/**
 * app.js 所有页面的根组件，处理应用级的query/sessionstorage
 */
// framework
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React, { useEffect } from 'react'
import { RestfulProvider } from "restful-react"
// import { useSessionStorage } from 'react-use'
import useSessionstorage from "@rooks/use-sessionstorage"

// component
import Head from 'next/head'
import { SkeletonTheme } from "react-loading-skeleton"
import '@/styles/spectre.styl'
import "@/node_modules/placeholder-loading/dist/css/placeholder-loading.min.css"

// fp
import { isEmpty } from 'lodash/fp'
import { map, identity } from 'ramda'
import { tryCatch } from 'rambdax'
import { trace } from 'ramda-extension'
// import { _ } from 'param.macro'

// util
import { DDYYAPI_BASE_URL } from '@/constant'
import ensure from '@/util/ensure'

function MyApp( { Component, pageProps }) {
  // 对象化query内嵌属性
  const query = (pageProps.query || {})
    |> map(tryCatch(JSON.parse, identity))
    |> trace('query')

  // 所有可接收的应用级query params(首次传入后将存入sessionStorage):
  const {
    userInfo = {},  // { app: { id, name, ... }, hos: { id, name, ... }, dept..., doc..., pat... }
    pageTitle = '点点医院量表问卷系统' // ::String
  } = query

  // useSessionstorage
  const [sessionUserInfo, setSessionUserInfo] = useSessionstorage('ddyy-survey-userInfo', {})
  const queryOrSessionUserInfo = isEmpty(userInfo) ? sessionUserInfo : userInfo
  const [sessionPageTitle, setSessionPageTitle] = useSessionstorage('ddyy-survey-pageTitle', '')

  useEffect(() => {
    // 不允许为null的应用级params(可能来自query，也可能来自sessionstorage)
    ensure(queryOrSessionUserInfo.app_id, 'queryOrSessionUserInfo.app_id不能为空')

    // setSessionStorage
    if(!(isEmpty(userInfo))) setSessionUserInfo(userInfo)
    if(!sessionPageTitle) setSessionPageTitle(pageTitle)
  }, [])

  return(
    <RestfulProvider base={DDYYAPI_BASE_URL}>
      <Head>
        <title>{ pageTitle } </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
      </Head>
      <SkeletonTheme color="#eee" highlightColor="#ddd" >
        {/* 将对象化后的query传给下级组件, 注：query必须放后面 */}
        <Component {  ...{ ...pageProps, query }  } />
      </SkeletonTheme>
    </RestfulProvider>
  )
}

export default MyApp
