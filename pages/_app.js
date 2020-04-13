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
// import ensure from '@/util/ensure'

function MyApp( { Component, pageProps }) {

  // localStorage
  const [userInfo, setUserInfo] = useSessionStorage('ddyy-survey-userInfo', {})
  useEffect(() => {
    // 解析url参数userInfo，如不为空，将其存入sessionStorage
    const userInfoQueryParam = pageProps?.query?.userInfo
      // |> decodeURIComponent
      |> tryCatch(JSON.parse, always({}))
      |> trace('userInfoQueryParam')
    if(!(isEmpty(userInfoQueryParam))) setUserInfo(userInfoQueryParam)
    console.log(userInfo.app_id)
    // @todo: 初次set之前会报错：
    // ensure(userInfo.app_id, '未传入app_id')
  }, [])

  return(
    <RestfulProvider base={DDYYAPI_BASE_URL}>
      <Head>
        <title>点点医院量表问卷系统</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
      </Head>
      <SkeletonTheme color="#eee" highlightColor="#ddd" >
        <Component {...pageProps} />
      </SkeletonTheme>
    </RestfulProvider>
  )
}
// class MyApp extends App {
//   componentDidMount() {
//     console.log(this.props?.pageProps?.query?.userInfo )
//   }
//   render () {
//     const { Component, pageProps } = this.props
//     // console.log({ pageProps })

//     return(
//       <RestfulProvider base={DDYYAPI_BASE_URL}>
//         <Head>
//           <title>点点医院量表问卷系统</title>
//           <meta charSet="utf-8" />
//           <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
//         </Head>
//         <SkeletonTheme color="#eee" highlightColor="#ddd" >
//           <Component {...pageProps} />
//         </SkeletonTheme>
//       </RestfulProvider>
//     )
//   }
// }

export default MyApp
