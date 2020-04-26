/**
 * app.js 所有页面的根组件，处理session级的query parmas
 */
// framework
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import React/*, { useEffect }*/ from 'react'
import { RestfulProvider } from "restful-react"
// import useSessionstorage from "@rooks/use-sessionstorage"
import Cookies from 'js-cookie'
import cookie from 'cookie'
import SimpleSchema from 'simpl-schema'
// component
import Head from 'next/head'
import { SkeletonTheme } from "react-loading-skeleton"
import '@/styles/spectre.styl'
import "@/node_modules/placeholder-loading/dist/css/placeholder-loading.min.css"
// import { useGlobalStore } from '@/globalStore'
// fp
import { isEmpty } from 'lodash/fp'
import { alwaysEmptyObject } from 'ramda-extension'
import { evolve, identity, isNil, /* always, */when } from 'ramda'
import { isNotPlainObj, isEmptyString, isNotEmpty } from 'ramda-adjunct'
import { tryCatch } from 'rambdax'
import { trace } from 'ramda-extension'
// util
// import sleep from 'await-sleep'
import { mayBeParseJSONObjectOrEmptyObject } from '@/util/filters'
// config
import { DDYYAPI_BASE_URL } from '@/constant'

const App = ({ Component, pageProps }) => {

  console.log(pageProps.headers)
  const severSidecookie = cookie.parse(pageProps.headers?.cookie || '')
  // all acceptable base query params
  // 外部系统首次到达本应用时必传(通过url传参)，收到后缓存到sessionstorage，供整个应用session生命周期使用
  const {
    /* eslint-disable */
    pageTitle = '',  // 页面title
    userInfo = {},                    // 用户信息
  } = pageProps.query
    // 确保其至少为空对象，避免解构出错
    |> when(isNil, alwaysEmptyObject)
    // 将可能存在的内嵌userInfo属性由json string转为对象，并确保其至少为空对象
    |> evolve({ userInfo: mayBeParseJSONObjectOrEmptyObject })
    // |> evolve({ userInfo: tryCatch(JSON.parse, identity) })
    // |> evolve({ userInfo: when(isNotPlainObj, alwaysEmptyObject) })
    |> trace('pageProps.query')

  // 如果userInfo不为空(一般为从外部首次进入本应用时)，校验其对象规格
  const userInfoSchema = new SimpleSchema({
    app_id       : { type: Number, required: true },
    hos_id       : { type: Number },
    pat_id       : { type: Number, required: true },
    user_role    : { type: String, allowedValues : ['pat', 'doc', 'dept', 'hos', 'admin', 'hos_admin'] },
    pat          : { type: Object }, // 用于在某些情况下展示患者信息
    'pat.id'     : { type: Number },
    'pat.name'   : { type: String },
    'pat.age'    : { type: String },
    'pat.gender' : { type: String, allowedValues : ['M', 'F', 'N'] },
  }, { requiredByDefault: false })
  isNotEmpty(userInfo) && userInfoSchema.validate(userInfo)

  if(!(isEmpty(userInfo))) Cookies.set('ddyy-survey-userInfo', userInfo)
  if(!(isEmptyString(pageTitle))) Cookies.set('ddyy-survey-pageTitle', pageTitle)
  // use
  const queryOrSessionPageTitle = pageTitle || severSidecookie.pageTitle || Cookies.get('ddyy-survey-pageTitle') /* || '点点医院量表问卷系统'*/
  // const sessionUserInfo = Cookies.get('ddyy-survey-userInfo') |> mayBeParseJSONObjectOrEmptyObject

  // const [sessionUserInfo, setSessionUserInfo] = useSessionstorage('ddyy-survey-userInfo', {})
  // const [sessionPageTitle, setSessionPageTitle] = useSessionstorage('ddyy-survey-pageTitle', '')
  // const [isSessionSaved, setIsSessionSaved] = useGlobalStore('isSessionSaved')

  // merge基础参数
  // const queryOrSessionUserInfo = sessionUserInfo
  // const queryOrSessionPageTitle = sessionPageTitle
  // const queryOrSessionUserInfo = userInfo |> when(isEmpty, always(sessionUserInfo))
  // const queryOrSessionPageTitle = pageTitle || sessionPageTitle || '点点医院量表问卷系统'


  // useEffect(async () => {
  //   // setSessionStorage
  //   if(!(isEmpty(userInfo))) setSessionUserInfo(userInfo)
  //   if(!sessionPageTitle) setSessionPageTitle(pageTitle)
  //   await sleep(1000)
  //   setIsSessionSaved(true)
  // }, [])

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

export default App
