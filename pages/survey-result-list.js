// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useSessionStorage } from 'react-use'

// component
import { NavBar, Badge, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import { ArrowIosForwardOutline as RightIcon } from '@styled-icons/evaicons-outline'
import Flex from 'styled-flex-component'

// fp
import { pick, map, compose } from 'ramda'
import { prepend } from 'rambdax'
import { isNotEmpty } from 'ramda-extension'
import { it/*, _*/ } from 'param.macro'

// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { omit } from '@/util/filters'
import { formatDateTimeM2 } from '@/util/date'
import { _body, _list, _item, _left, _right } from '@/util/semantic-tags'

// props
export const getServerSideProps = async ({ /*req, res, */query }) => {
  const ownersQueryCondtion = query
    |> pick(['hos_id', 'dept_id', 'doc_id', 'pat_id'])
    |> map(compose(prepend('eq.'), String))
  ensure(isNotEmpty(ownersQueryCondtion), 'query参数hos_id/dept_id/doc_id/pat_id不可全为空')

  const surveyResults = await agent
    .get('common-biz/rest/survey_result')
    .query({
      ...ownersQueryCondtion,
      select : '*, survey(*)',
    })
    .then(it.body)
  return { props: { query, surveyResults } }
}

// nav
const Nav$ = () => {
  return (
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      评测结果列表
    </NavBar>
  )
}

const Item$ = ({ surveyResult }) => {
  const [pageTitle] = useSessionStorage('ddyy-survey-pageTitle')
  return (
    <Link className=" py3 bg-white bb __flex j-between a-center" href={{ pathname: 'survey-result', query: { pageTitle, id: surveyResult.id }}} key={surveyResult.id}>
      <_item className=" py3 bg-white bb __flex j-between a-center">
        {/* 左侧内容 */}
        <_left className="lh2">
          <div className=""> {surveyResult.survey.title |> omit(36)} </div>
          <div className="f4 gray"> { surveyResult.created_at |> formatDateTimeM2 }</div>
{/*          <div className="pl1 f4 white round"
            x-if={surveyResult.result}
            x-class={surveyResult.is_ok ? 'bg-success' : 'bg-error'}>
            { surveyResult.score + '分，' + surveyResult.result }
          </div>
*/}          <Badge
            x-if={surveyResult.result}
            text={ surveyResult.score + '分，' + surveyResult.result }
            style={{ background: surveyResult.is_ok ? 'limegreen' : 'orangered', padding: '0 3px' }}
          >
          </Badge>
        </_left>

        <_right>
          <RightIcon className="gray-light" size="24" />
        </_right>

      </_item>
    </Link>
  )
}

const List$ = ({ surveyResults }) => {
  return <>
    {surveyResults.map(surveyResult => <Item$ key={surveyResult.id} {...{ surveyResult }} />)}
  </>
}

// main
const SurveyResultList$ = ({ surveyResults }) => {
  return <>
    <Nav$ />
    <_body className="absolute t46 l0 r0 b0 px4 w12 bg-white">
      {<List$ {...{ surveyResults }} />}
    </_body>
  </>
}

export default SurveyResultList$
