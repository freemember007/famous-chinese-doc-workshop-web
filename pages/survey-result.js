import React from 'react'
import Router from 'next/router'
import { NavBar, Icon, Button } from 'antd-mobile'
import Flex from 'styled-flex-component'
import { it/*, _*/ } from 'param.macro'
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { _title, _box, _text } from '@/util/semantic-tags'

export async function getServerSideProps({ /*req, res, */query}) {
  ensure(query?.id, 'query参数(问卷结果)id不能为空')
  const survey_result = await agent
    .get('common-biz/rest/survey_result')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id     : 'eq.' + query.id,
      select : 'id, score, survey(id, title, explain)'
    })
    .then(it.body)
  return { props: { query, survey_result } }
}

// main
function Main$(props) {
  console.log({props})
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
    <NavBar
      mode="light"
      leftContent="返回"
      icon={<Icon type="left" />}
      onClick={ () => Router.replace('/survey-list') }
    >
      测试结果
    </NavBar>
  )
}

function Body$({ survey_result }) {
  return (
    <article className="absolute t46 l0 r0 b0 p4 w100 bg-white">

      <_title className="py2 f2 tc">
        <span>您的</span>
        <span className="">{ survey_result.survey.title } </span>
        <span>得分：</span>
      </_title>

      <_box className="w100 vh20 my4 white bg-success __flex j-center a-center">
        <div style={{ fontSize: '60px' }}> { survey_result.score }</div>
      </_box>
      <Flex justifyBetween className="mt2 f4 gray">
        <div> {'本问卷由' + '点点云科室' + '提供'}</div>
        <div> {'23452人测过'}</div>
      </Flex>

      <Button className="my4" type="default" >找医生</Button>
    </article>
  )
}

export default Main$
