/**
 * app.js 所有页面的根组件，处理应用级的query/sessionstorage
 */
// framework
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React, { useEffect } from 'react'
import { RestfulProvider } from "restful-react"
import useSessionstorage from "@rooks/use-sessionstorage"
// component
import Head from 'next/head'
import { SkeletonTheme } from "react-loading-skeleton"
import '@/styles/spectre.styl'
import "@/node_modules/placeholder-loading/dist/css/placeholder-loading.min.css"
// fp
import { isEmpty } from 'lodash/fp'
import { alwaysEmptyObject } from 'ramda-extension'
import { pickAll, evolve, identity, isNil, always, when } from 'ramda'
import { isNotPlainObj, isNotEmpty } from 'ramda-adjunct'
import { tryCatch } from 'rambdax'
// import { trace } from 'ramda-extension'
// util
import ensure from '@/util/ensure'
// config
import { DDYYAPI_BASE_URL } from '@/constant'
import { userInfoSchema } from '@/config/schemas'

function MyApp( { Component, pageProps }) {
  // @api: 全局基础query参数，用于初始化页面title，及缓存app/用户信息到session，
  // 外部系统首次到达本应用时必传(通过url传参)
  const baseQueryParams = pageProps.query
    |> when(isNil, alwaysEmptyObject)
    |> pickAll([
      'pageTitle', //::String
      'userInfo',  //::Object
    ])
    |> evolve({ userInfo: tryCatch(JSON.parse, identity) })
    |> evolve({ userInfo: when(isNotPlainObj, alwaysEmptyObject) })
    |> evolve({ pageTitle: when(isNil, always('点点医院量表问卷系统')) })
    // |> trace('baseQueryParams')
  // 如果userInfo query参数不为空，校验其规格

  // useSessionstorage
  const [sessionUserInfo, setSessionUserInfo] = useSessionstorage('ddyy-survey-userInfo', {})
  const [sessionPageTitle, setSessionPageTitle] = useSessionstorage('ddyy-survey-pageTitle', '')

  // merge基础参数
  const queryOrSessionUserInfo = baseQueryParams.userInfo |> when(isEmpty, always(sessionUserInfo))
  // 直接使用query参数比较平滑，如无则用sessionPageTitle，会闪一下。
  const queryOrSessionPageTitle = baseQueryParams.pageTitle || sessionPageTitle

  useEffect(() => {
    isNotEmpty(baseQueryParams.userInfo) && userInfoSchema.validate(baseQueryParams.userInfo)
    // 不允许为null的基础参数
    ensure(queryOrSessionUserInfo.app_id, 'queryOrSessionUserInfo.app_id不能为空')

    // setSessionStorage
    if(!(isEmpty(baseQueryParams.userInfo))) setSessionUserInfo(baseQueryParams.userInfo)
    if(!sessionPageTitle) setSessionPageTitle(baseQueryParams.pageTitle)
  }, [])

  return(
    <RestfulProvider base={DDYYAPI_BASE_URL}>
      <Head>
        <title>{ queryOrSessionPageTitle } </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
      </Head>
      <SkeletonTheme color="#eee" highlightColor="#ddd" >
        <Component { ...pageProps } />
      </SkeletonTheme>
    </RestfulProvider>
  )
}

export default MyApp
