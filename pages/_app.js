// framework
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React, { useEffect } from 'react'
import { RestfulProvider } from "restful-react"
import { useSessionStorage } from 'react-use'

// component
import Head from 'next/head'
import { SkeletonTheme } from "react-loading-skeleton"
import '@/styles/spectre.styl'
import "@/node_modules/placeholder-loading/dist/css/placeholder-loading.min.css"

// fp
import { isEmpty } from 'lodash/fp'
import { tryCatch, always } from 'ramda'
import { trace } from 'ramda-extension'
// import { _ } from 'param.macro'

// util
import { DDYYAPI_BASE_URL } from '@/constant'
import ensure from '@/util/ensure'

function MyApp( { Component, pageProps }) {

  // 解析url参数userInfo
  const userInfoQueryParam = pageProps?.query?.userInfo
    // |> decodeURIComponent
    |> tryCatch(JSON.parse, always({}))
    |> trace('userInfoQueryParam')
  const pageTitleQueryParam = pageProps?.query?.pageTitle

  // useLocalStorage
  const [userInfo, setUserInfo] = useSessionStorage('ddyy-survey-userInfo', {})
  const [, setPageTitle] = useSessionStorage('ddyy-survey-pageTitle', '')
  const maybeUserInfo = isEmpty(userInfoQueryParam) ? userInfo : userInfoQueryParam
  const pageTitle = pageTitleQueryParam || '点点医院量表问卷系统'

  useEffect(() => {
    // 确保app传入所需参数（注：不能在setUserInfo后直接判断userInfo，因存入需要时间）
    console.log({ maybeUserInfo })
    ensure(maybeUserInfo.hos_id, 'app参数hos_id不能为空')
    setPageTitle(pageTitle)
    // 如不为空，将其存入sessionStorage
    if(!(isEmpty(userInfoQueryParam))) setUserInfo(userInfoQueryParam)
  }, [pageProps?.query])

  return(
    <RestfulProvider base={DDYYAPI_BASE_URL}>
      <Head>
        <title>{ pageTitle } </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
      </Head>
      <SkeletonTheme color="#eee" highlightColor="#ddd" >
        <Component pageTitle={pageTitle} { ...pageProps} />
      </SkeletonTheme>
    </RestfulProvider>
  )
}

export default MyApp
