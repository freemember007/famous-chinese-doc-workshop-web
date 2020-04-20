// framework
// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { view } from 'react-easy-state'
import globalStore from '@/globalStore'
import Link from 'next/link'
import { useGet, Get, Mutate } from "restful-react"
// import { useSessionStorage } from 'react-use'
import useSessionstorage from "@rooks/use-sessionstorage"
// components
import { Button, NavBar } from 'antd-mobile'
import { FadeOut } from 'animate-css-styled-components'
import Skeleton from "react-loading-skeleton"
import Flex from 'styled-flex-component'
import Linkify from 'linkifyjs/react'
import LazyLoad from 'react-lazyload'
import Image from 'react-shimmer'
// fp
import { join } from 'ramda'
// util
import {_list, _item } from '@/util/semantic-tags'

// props
export async function getServerSideProps({ query }) {
  return { props: { query: {
    ...query,
    // only for dev
    pageTitle : '点点医院量表问卷系统(dev)',
    userInfo  : {
      app_id : 1,
      hos_id : 1,
      pat_id : 1,
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
  const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle')

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
      <Link href={{ pathname: 'survey-list', query: { pageTitle } }}>
        <Button type="primary"> 问卷列表 </Button>
      </Link>
      <div className="my4" />
      <Link href={{ pathname: 'survey-result', query: { pageTitle, id: 242 } }}>
        <Button type="primary"> 问卷结果 </Button>
      </Link>
    </_list>
  )
}

function StoreTest$() {
  return (
    <section className="p2">
      <p onClick={ globalStore.getPlace }>{ globalStore.place }</p>
    </section>
  )
}
StoreTest$ = view(StoreTest$)

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
                      <Flex column className="p3">
                        { loading && <p>loading...</p> }
                        { error   && <FadeOut duration="0.3s" delay="1s"><p>{ [error?.message, error?.data?.message] |> join(', ') }</p></FadeOut> }
                        <Button onClick={ () => mutate({ titlse: survey.title + '1' })}>修改标题</Button>
                      </Flex>
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
      <div className="bg-white" >
        <p className="f1 tc w10" style={{ fontSize: "48px" }}>{null || <Skeleton />}</p>
        <p className="f4 w12">{null || <Skeleton count={3} />}</p>
        <Flex>
          <div className="flex1 mx2"> {null || <Skeleton count={2} />} </div>
          <div className="flex1 mx2"> {null || <Skeleton count={2} />} </div>
        </Flex>
      </div>
      <Body$ />
      <Image
        src="https://newevolutiondesigns.com/images/freebies/tropical-beach-background-8.jpg"
        width={320} height={240}
        style={{ objectFit: 'cover' }}
      />
      <StoreTest$ />
      <Questions$ />
      <LinkifyTest$ />
    </section>
  )
}

export default Index$
