import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { useGet } from "restful-react"
import agent from '@/util/request'
import { it/*, _*/ } from 'param.macro'
import { formatDateTimeM2 } from '@/util/date'
// import { matchPairs, ANY } from 'pampy'
// import { always } from 'ramda'

export async function getServerSideProps() {
  return { props: {
    surveys: await agent.get('common-biz/rest/survey').then(it.body)
  } }
}

// main
function Main(props) {
  return (
    <section>
      <Nav$ />
      <Body$ {...props} />
    </section>
  )
}

//- 导航
function Nav$() {
  return (
    <NavBar mode="light" leftContent="返回" icon={<Icon type="left" />} >
      问卷列表
    </NavBar>
  )
}

function Body$(props) {
  return (
    <section className="p4">
      {props.surveys.map(survey =>
        <div className="f3 __flex j-between" key="index">
          <div> {survey.title} </div>
          <div> {survey.created_at |> formatDateTimeM2}</div>
        </div>
      )}
    </section>
  )
}

export default Main
