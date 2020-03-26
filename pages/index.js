// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import Link from 'next/link'
import { Button, NavBar } from 'antd-mobile'
import { useGet, Get } from "restful-react"
import { join } from 'ramda'

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
    <section className="m3 p3">
      { loading && <p>loading</p> }
      { error   && <p>{ error.message }</p> }
      { surveys && surveys.map((survey, index) =>
        <p key={ index }>{ survey.title }</p>
      )}
      <Link href={{ pathname: '/survey-list' }}>
        <Button type="primary"> 问卷列表 </Button>
      </Link>
    </section>
  )
}

function Questions$() {
  return (
    <Get path="common-biz/rest/questions?select=*">
      { (questions, { loading, error }) => {
        return (
          <section className="m3 p3">
            { loading   && <p>loading</p> }
            { error     && <p>{ [error?.message, error?.data?.message] |> join(', ') }</p> }
            { questions && questions.map((survey, index) =>
              <p key={ index }>{ survey.title }</p>
            )}
          </section>
        )
      }}
    </Get>
  )
}

export default Main
