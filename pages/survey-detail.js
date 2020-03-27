import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { NavBar, Icon, Button } from 'antd-mobile'
import { it/*, _*/ } from 'param.macro'
import agent from '@/util/request'
import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder } from '@/util/filters'
import { _title, _subTitle, _text } from '@/util/semantic-tags'

export async function getServerSideProps({ /*req, res, */query}) {
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({ id: 'eq.' + query.id })
    .then(it.body)
  return { props: { query, survey } }
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
    <NavBar
      mode="light"
      leftContent="返回"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      问卷详情
    </NavBar>
  )
}

function Body$({ survey }) {
  return (
    <article className="absolute t46 l0 r0 b0 px4 w100 bg-white">
      <img width="100%" height="200" src={survey.image |> imagePlaceholder } />

      <_title className="py2 f1 tc"> {survey.title} </_title>

      <_subTitle className="py2 f4 gray __flex j-center">
        <div> {survey.created_at |> formatDateTimeM2}</div>
        <div className="ml2"> {'23452人测过'}</div>
      </_subTitle>

      <_text className="dark lh2">
        { survey.intro }
      </_text>
      <Link href={{ pathname: '/survey-result', query: { id: survey.id }}}>
        <Button className="my4" type="primary" >开始测试</Button>
      </Link>
    </article>
  )
}

export default Main$
