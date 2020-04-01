// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { store as createStore, view } from 'react-easy-state'
import globalStore from '@/globalStore'
import sleep from 'await-sleep'
import Link from 'next/link'
import { Button, NavBar } from 'antd-mobile'
import { FadeOut } from 'animate-css-styled-components'
// import Linkify from 'react-linkify'
import Linkify from 'linkifyjs/react'
import Flex from 'styled-flex-component'
import { useGet, Get, Mutate } from "restful-react"
import { join } from 'ramda'
import {_list, _item } from '@/util/semantic-tags'

const store = createStore({
  place: '定位中...',

  async getPlace() {
    await sleep(100)
    store.place = 'hangzhou'
  },
})

// main
function Main$() {
  return (
    <section>
      <Nav$ />
      <Body$ />
      <StoreTest$ />
      <Questions$ />
      <LinkifyTest$ />
    </section>
  )
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
  const { data: surveys, loading, error } = useGet({
    path        : 'common-biz/rest/survey',
    queryParams : {id: 'in.(1, 2, 3, 4)', select: '*, a'},
    resolve     : res => res,
  })
  return (
    <_list className="m3 p3">
      { loading && <p>loading</p> }
      { error   && <p>{ error.message }</p> }
      { surveys && surveys.map((survey, index) =>
        <_item key={ index }>{ survey.title }</_item>
      )}
      <Link href={{ pathname: '/survey-list' }}>
        <Button type="primary"> 问卷列表 </Button>
      </Link>
      <Link href={{ pathname: '/survey-do' }}>
        <Button type="primary"> 做问卷 </Button>
      </Link>
    </_list>
  )
}

function StoreTest$() {
  return (
    <section className="p2">
      <p onClick={ store.getPlace }>{ store.place }</p>
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
    <Linkify>
      See source code at github.com/tasti/react-linkify/.
    </Linkify>
  )
}
export default Main$
