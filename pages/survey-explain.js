// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import useSessionstorage from "@rooks/use-sessionstorage"
// component
import { NavBar, Button } from 'antd-mobile'
// fp
import { find } from 'ramda'
import { inRange } from 'lodash/fp'
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { _title, _subTitle, _box, _text } from '@/util/semantic-tags'

// props
export async function getServerSideProps({ /*req, res, */query}) {
  // all acceptable and not nullable query params
  const {
    id          // 问卷结果id
  } = query
  ensure(id, '请求参数(问卷结果id)不能为空')

  const survey_result = await agent
    .get('common-biz/rest/survey_result')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id     : 'eq.' + id,
      select : 'id, score, survey(id, title, explain)'
    })
    .then(it.body)
  return { props: { query, survey_result } }
}

//- 导航
function Nav$() {
  return (
    <NavBar
      mode="light"
      onClick={ () => Router.replace('/survey-list') }
    >
      测试结果
    </NavBar>
  )
}

// body
function Body$({ /*pageTitle,*/ survey_result }) {
  const matchedExplain = survey_result.survey.explain
    |> find(i => inRange(i.score_gte, i.score_lte + 1, survey_result.score))
  const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle', '')
  const [userInfo] = useSessionstorage('ddyy-survey-userInfo', {})

  return (
    <article className="absolute t46 l0 r0 b0 p4 w100 bg-white">

      <_title className="py2 f2 tc">
        <span>您的</span>
        <span className="">{ survey_result.survey.title } </span>
        <span>得分：</span>
      </_title>

      <_box className="w100 vh20 my4 white __flex j-center a-center" x-class={matchedExplain.is_ok ? 'bg-success' : 'bg-error'}>
        <div style={{ fontSize: '60px' }}> { survey_result.score }</div>
      </_box>
      <_subTitle className="mt2 f4 gray __flex j-between">
        <div> {'本问卷由' + '点点云科室' + '提供'}</div>
        <div> {'23452人测过'}</div>
      </_subTitle>

      <_title className="my4">
        <span>您的状态: </span>
        <span>{matchedExplain.result}</span>
      </_title>
      <_text className="lh2">{matchedExplain.describe}</_text>

      <Link href={{ pathname: 'survey-result-list', query:
        {
          pageTitle,
          pat_id    : userInfo?.pat_id,
          ownerName : userInfo?.pat?.name
        }
      }}>
        <Button className="my4" type="default">我的全部评测</Button>
      </Link>


    </article>
  )
}

// main
function SurveyExplain$({ survey_result }) {
  return (
    <section>
      <Nav$ />
      <Body$ {...{ survey_result } } />
    </section>
  )
}

export default SurveyExplain$
