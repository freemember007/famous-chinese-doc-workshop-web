import React from 'react'
import { NavBar, Icon, Button } from 'antd-mobile'
import styled from 'styled-components'
// import { useGet } from "restful-react"
import { it/*, _*/ } from 'param.macro'
// import { matchPairs, ANY } from 'pampy'
// import { always } from 'ramda'
import agent from '@/util/request'
// import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder } from '@/util/filters'

export async function getServerSideProps() {
  return { props: {
    surveys: await agent.get('common-biz/rest/survey').then(it.body)
  } }
}

// main
function Main$(props) {
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
    <NavBar mode="light" leftContent="" icon={<Icon type="left" />} >
      问卷列表
    </NavBar>
  )
}

function Body$(props) {
  const List  = styled.div``
  const Item  = styled.div``
  const Right = styled.div``
  return (
    <ul className="absolute t46 l0 r0 b0 px4 w100 bg-white">
      {props.surveys.map(survey =>
        <li className="py3 bg-white bb __flex" key={survey.id}>
          <img width="80px" height="80px" src={survey.image |> imagePlaceholder} />
          <section className="ml2 flex1 __flex col j-between a-start">
            <div> {survey.title} </div>
            {/*<div className="gray"> {survey.created_at |> formatDateTimeM2}</div>*/}
            <div className="f4 gray"> {'2345人测过'}</div>
            <div className="s-end">
              <Button type="primary" size="small">我要测试</Button>
            </div>
          </section>
        </li>
      )}
    </ul>
  )
}

export default Main$
