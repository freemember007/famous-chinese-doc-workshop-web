// framework
// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import Link from 'next/link'
import { useGet, Get, Mutate } from "restful-react"
// import useSessionstorage from "@rooks/use-sessionstorage"
import Cookies from 'js-cookie'
// components
import { Button, NavBar } from 'antd-mobile'
import { FadeOut } from 'animate-css-styled-components'
import Linkify from 'linkifyjs/react'
import LazyLoad from 'react-lazyload'
// import { useGlobalStore } from '@/globalStore'
// fp
import { join } from 'ramda'
// util
import {_list, _item } from '@/util/semantic-tags'
import { mayBeParseJSONObjectOrEmptyObject } from '@/util/filters'

// props
export async function getServerSideProps({ query }) {
  return { props: { query: {
    ...query,
    // only for dev
    pageTitle : '点点医院量表问卷系统(dev)',
    userInfo  : {
      app_id : 1,                        // 云科室
      hos_id : 3, pat_id : 106276,       // 点点云科室萧江平
      // hos_id : 10275, pat_id : 2548629,  // 鞍山精卫萧江平
      pat    : { name: 'xjp', age: '80', gender: 'M' },
    },
  } } }
}

//- 导航
function Nav$() {
  return (
    <NavBar mode="light">
      问卷首页
    </NavBar>
  )
}

function Body$() {
  // @todo: 首次从sessionstorage取会存在取不到的情况...
  // const [isSessionSaved] = useGlobalStore('isSessionSaved')
  // const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle')
  // const [userInfo] = useSessionstorage('ddyy-survey-userInfo', {})
  // const pageTitle = Cookies.get('ddyy-survey-pageTitle')
  const userInfo = Cookies.get('ddyy-survey-userInfo') |> mayBeParseJSONObjectOrEmptyObject
  console.log({userInfo})

  const { data: surveys, loading, error } = useGet({
    path        : 'common-biz/rest/survey',
    queryParams : {id: 'in.(1, 2, 3, 4)', select: '*, a'},
    // resolve     : res => res,
  })
  return (
    <_list className="m3 p3">
      { loading && <p>loading</p> }
      { error   && <p>{ error.message }</p> }
      { surveys && surveys.map((survey, index) =>
        <_item key={ index }>{ survey.title }</_item>
      )}
      {/*<p> {isSessionSaved ? 'true' : 'false'} </p>*/}
      <Link href={{ pathname: 'survey-list', query: { app_id: userInfo.app_id, hos_id: userInfo.hos_id } }}>
        <Button type="primary"> 问卷列表 </Button>
      </Link>
      <div className="my4" />
      <Link href={{ pathname: 'survey-result-list', query: { pat_id: 2548629, ownerName: '萧江平' } }}>
        <Button type="primary"> 问卷结果 </Button>

      </Link>
    </_list>
  )
}

function Questions$() {
  return (
    <Get path="common-biz/rest/question" queryParams={{
      id     : 'in.1,2,3,4',
      select : '*,survey(*),options:option(*)',
    }}>
      { (questions, { loading, error }) => {
        return (
          <_list className="p3">
            { loading   && <p>loading...</p> }
            { error     && <p>{ [error?.message, error?.data?.message] |> join(', ') }</p> }
            { questions && questions.map((survey, index) =>
              <_item className="p2" key={ index }>
                <p>{ survey.title }</p>
                <Mutate
                  verb="PATCH"
                  queryParams={{ id: 'eq.1' }}
                  requestOptions={{ headers: { Prefer: 'return=representation'} }}
                >
                  { (mutate, { loading, error }) => {
                    return (
                      <div className="p3 __flex column">
                        { loading && <p>loading...</p> }
                        { error   && <FadeOut duration="0.3s" delay="1s"><p>{ [error?.message, error?.data?.message] |> join(', ') }</p></FadeOut> }
                        <Button onClick={ () => mutate({ titlse: survey.title + '1' })}>修改标题</Button>
                      </div>
                    )
                  }}
                </Mutate>
              </_item>
            )}
          </_list>
        )
      }}

    </Get>
  )
}

function LinkifyTest$() {
  return (
    <LazyLoad height={200}>
      <Linkify>
        See source code at github.com/tasti/react-linkify/.
      </Linkify>
    </LazyLoad>

  )
}

// main
function Index$() {
  return (
    <section>
      {/*<ActivityIndicator toast text="正在加载" />*/}
      <Nav$ />
      <Body$ />
      <Questions$ />
      <LinkifyTest$ />
    </section>
  )
}

export default Index$
