/**
 * index.js 首页，目前仅用于测试
 */
// framework
import React from 'react'
import Router from 'next/router'
// component
import { NavBar, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Skeleton from 'react-loading-skeleton'
import { BulletList } from 'react-content-loader'
// fp
import { pick, evolve } from 'ramda'
import { includes, isEmpty, random, sortBy } from 'lodash/fp'
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { formatDateTimeM2 } from '@/util/date'
import { _body, _title, _subTitle, _item } from '@/util/semantic-tags'

// props
export const getServerSideProps = async ({ query }) => {
  // @api
  const queryParams = query
    |> pick([
      'id',        // 问卷结果id
    ])
  ensure(queryParams.id, '请求参数(问卷结果id)不能为空')

  const surveyResult = await agent
    .get('common-biz/rest/survey_result')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id     : 'eq.' + queryParams.id,
      select : '*, survey(*), questionResults:question_result(*, question(*, options:option(*)))',
      'question_result.question.option.order' : 'order_num',
    })
    .then(it.body)
    .then(evolve({
      questionResults: sortBy('question.order_num')
    }))

  return { props: { query, surveyResult } }
}

const Nav$ = () =>
  <NavBar mode="light" icon={<Icon type="left" />} onClick={ Router.back }>
    评测结果详情
  </NavBar>

const Title$ = ({ survey, surveyResult }) =>
  <>
    <_title className="py2 lh2 f1 tc"> {survey.title || <Skeleton/>} </_title>

    <_subTitle className="py2 w12 f4 gray __flex j-center">
      { isEmpty(survey) ? <div className="w6"><Skeleton/></div> :
        <div>
          <span>{'测试时间: ' + (surveyResult.created_at |> formatDateTimeM2)}</span>
        </div>
      }
    </_subTitle>
  </>

const RadioItem$ = ({ questionResult, option }) =>
  <Radio.RadioItem
    key={ option.id }
    checked={ questionResult.option_id === option.id }
  >
    <div className="f3 gray">{ option.text }</div>
  </Radio.RadioItem>

const CheckItem$ = ({ questionResult, option }) =>
  <Checkbox.CheckboxItem
    key={ option.id }
    checked={ questionResult.option_ids |> includes(option.id) }
  >
    <div className="f3 gray">{ option.text }</div>
  </Checkbox.CheckboxItem>

const InputItem$ = ({ questionResult }) =>
  <TextareaItem
    autoHeight
    placeholder="请输入..."
    rows={ 5 }
    value={ questionResult.input }
  />

const QuestionResult$ = ({ questionResult }) => {
  const question = questionResult.question
  return (
    <_item key={questionResult.id} className="my4">
      {/* 问题标题 */}
      <_title className="py4 f2 lh15 bold"> {question.title} </_title>

      {/* 如果是单选 */}
      <List x-if={question.type === 'radio'}>
        {question.options.map(option => <RadioItem$ key={option.id} {...{ questionResult, option }} />)}
      </List>
      {/* 如果是多选 */}
      <List x-if={question.type === 'check'}>
        {question.options.map(option => <CheckItem$ key={option.id} {...{ questionResult, option }} />)}
      </List>
      {/* 如果是开放问题 */}
      {question.type === 'open' && <InputItem$ {...{ questionResult }} /> }

    </_item>
  )
}

const QuestionResultListSkeleton$ = () =>
  <>
    {[1,2,3,4,5].map(i=>
      <div key={i} className="my4">
        <div className={'w' + random(11, 12)}> <Skeleton height={24} /> </div>
        <BulletList/>
      </div>
    )}
  </>

const QuestionResultList$ = ({ surveyResult }) =>
  <>
    {surveyResult.questionResults.map(questionResult => <QuestionResult$ key={questionResult.id} {...{ questionResult }} />)}
  </>

// main
const SurveyResult$ = ({ /*query, */surveyResult }) =>
  <>
    <Nav$ />
    <_body className="pt4 px4 w12">
      <Title$ {...{ survey: surveyResult.survey, surveyResult }} />
      {isEmpty(surveyResult) ? <QuestionResultListSkeleton$ /> : <QuestionResultList$ {...{ surveyResult }} />}
    </_body>
  </>

export default SurveyResult$
