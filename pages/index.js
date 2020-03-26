// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import Link from 'next/link'
import { Button, NavBar } from 'antd-mobile'
import { FadeOutDown } from 'animate-css-styled-components'
import Flex from 'styled-flex-component'
import { useGet, Get, Mutate } from "restful-react"
import { join } from 'ramda'
import {_list, _item } from '@/util/semantic-tags'

// main
function Main() {
  return (
    <section>
      <Nav$ />
      <Body$ />
      {<Questions$ />}
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
            { loading   && <p>loading</p> }
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
                        { loading && <p>loading</p> }
                        { error   && <FadeOutDown duration="0.3s" delay="1s">{ [error?.message, error?.data?.message] |> join(', ') }</FadeOutDown> }
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

export default Main
