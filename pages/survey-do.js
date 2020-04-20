// framework
import React from 'react'
import Router from 'next/router'
import { useMutate } from "restful-react"
// import { useSessionStorage } from 'react-use'
import useSessionstorage from "@rooks/use-sessionstorage"
import { createGlobalState } from 'react-hooks-global-state'

// component
import { NavBar, Button, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Flex from 'styled-flex-component'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

// fp
// import { without } from 'ramda'
// import { match, matchPairs, ANY } from 'pampy'
import { includes } from 'lodash/fp'
import { it/*, _*/ } from 'param.macro'

// util
import agent from '@/util/request'
import sleep from 'await-sleep'
import ensure from '@/util/ensure'
import { omit, percent, concatOrWithout/*, transJsonArrayValueToPgArrayStr*/ } from '@/util/filters'
import { _body } from '@/util/semantic-tags'

// props
export const getServerSideProps = async ({ /*req, res, */query }) => {
  // all acceptable and not nullable query params
  const {
    id          // 问卷id
  } = query
  ensure(id, '请求参数(问卷id)不能为空')

  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                      : 'eq.' + id,
      select                  : '*, questions:question(*, options:option(*))',
      'question.order'        : 'order_num',
      'question.option.order' : 'order_num',
    })
    .then(it.body)
  return { props: { query, survey } }
}

// useGlobalState
const { useGlobalState } = createGlobalState({
  currentQuestionIndex    : 0,        // 当前问题索引
  questionsResult         : {},       // 全部问题结果键值对
})

// nav
const Nav$ = ({ surveyTitle }) => {
  return (
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      {surveyTitle |> omit(16)}
    </NavBar>
  )
}

const Step$ = ({ currentQuestionIndex, surveyQuestionsLength, currentQuestionFinished }) => {
  const surveyQuestionsFinishedCount = currentQuestionIndex + (currentQuestionFinished ? 1 : 0)
  return <Flex alignCenter className="my4 py2" >
    {/* 进度数 */}
    <div className="gray f2"> { [surveyQuestionsFinishedCount, surveyQuestionsLength].join('/') } </div>
    {/* 进度条 */}
    <div className="flex1 relative ml4" style={{ height: '5px' }}>
      <div className="absolute h100 z2 round bg-primary" style={{
        width: surveyQuestionsFinishedCount/surveyQuestionsLength |> percent
      }}></div>
      <div className="absolute h100 z1 round w12 bg-gray"></div>
    </div>
  </Flex>
}

const RadioGroup$ = ({ currentQuestion, surveyQuestionsLength }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  return currentQuestion.options.map(option =>
    <Radio.RadioItem
      key={option.id}
      checked={questionsResult[currentQuestion.id] === option.id}
      onChange={async () => {
        setQuestionsResult({
          ...questionsResult,
          [currentQuestion.id]: option.id,
        })
        await sleep(200)
        // 单选选择后，自动跳到下一题
        if(currentQuestionIndex < surveyQuestionsLength - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
      }}>
      <div className="f1 dark">{ option.text }</div>
    </Radio.RadioItem>)
}

const CheckGroup$ = ({ currentQuestion }) => {
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  return currentQuestion.options.map(option =>
    <Checkbox.CheckboxItem
      key={ option.id }
      checked={questionsResult[currentQuestion.id] |> includes(option.id)}
      onChange={(/*target*/) => {
        setQuestionsResult({
          ...questionsResult,
          [currentQuestion.id] : questionsResult[currentQuestion.id]
            |> concatOrWithout(option.id)
        })
      }}>
      <div className="f1 dark">{ option.text }</div>
    </Checkbox.CheckboxItem>)
}

const InputItem$ = ({ currentQuestion }) => {
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  return (
    <TextareaItem
      autoHeight
      placeholder="请输入..."
      labelNumber={ 5 }
      rows={ 5 }
      value={ questionsResult[currentQuestion.id] }
      onChange={ value => {
        setQuestionsResult({
          ...questionsResult,
          [currentQuestion.id]: value,
        })
      }}
    />
  )
}

const Question$ = ({ currentQuestion, surveyQuestionsLength }) => {
  return (
    <SwitchTransition>
      <CSSTransition key={currentQuestion.id} timeout={200} classNames="fade-transiton">
        <div>
          {/* 问题标题 */}
          <div className="py4 f1 bold"> {currentQuestion.title} </div>

          {/* 问题内容 */}
          <List className="f3 py4">
            { currentQuestion.type === 'radio' && <RadioGroup$  {...{ currentQuestion, surveyQuestionsLength }} /> }
            { currentQuestion.type === 'check' && <CheckGroup$  {...{ currentQuestion }} /> }
            { /input|open/.test(currentQuestion.type) && <InputItem$  {...{ currentQuestion }} /> }
          </List>
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}

const BtnGroup$ = ({ surveyQuestionsLength, currentQuestionFinished, surveyId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [questionsResult ] = useGlobalState('questionsResult')
  const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle')
  const [userInfo] = useSessionstorage('ddyy-survey-userInfo', {})
  console.log(userInfo) // 可用来观察根组件渲染次数

  const { mutate, loading, /*error*/ } = useMutate({
    verb : 'POST',
    path : 'common-biz/rest/rpc/graph_insert_survey_result',
  })

  const saveSurveyResult = () => {
    mutate({
      survey_id             : surveyId,
      hos_id                : userInfo.hos_id,
      pat_id                : userInfo.pat_id,
      questions_result_data : questionsResult,
    }).then(res => Router.replace({ pathname: '/ddyy-common-business-react/survey-explain', query: { pageTitle, id: res?.[0]?.id } }))
  }

  return <Flex className="mt4">
    <Button
      x-if={ currentQuestionIndex > 0 }
      disabled={loading}
      className="mx2 flex1"
      type="primary"
      onClick={() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
      }}
    >上一题</Button>
    <Button
      x-if={currentQuestionIndex < surveyQuestionsLength - 1}
      disabled={!currentQuestionFinished}
      className="mx2 flex1"
      type="primary"
      onClick={() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }}
    >下一题</Button>
    <Button
      x-if={ currentQuestionIndex === surveyQuestionsLength - 1 }
      disabled={!currentQuestionFinished || loading}
      className="mx2 flex1"
      type="primary"
      loading={loading}
      onClick={saveSurveyResult}
    >提交</Button>
  </Flex>
}

// main
const SurveyDo$ = ({ survey }) => {
  const [currentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [questionsResult] = useGlobalState('questionsResult')
  const currentQuestion = survey.questions[currentQuestionIndex] || {}
  const currentQuestionFinished = !!questionsResult[currentQuestion.id]
  const surveyQuestionsLength = survey.questions.length
  return (
    <section>
      <Nav$ {...{ surveyTitle: survey.title }} />
      <_body className="absolute t46 l0 r0 b0 px4 w12 bg-white">
        <Step$ {...{ currentQuestionIndex, surveyQuestionsLength, currentQuestionFinished }}/>
        <Question$ {...{ survey, surveyQuestionsLength, currentQuestion }}/>
        <BtnGroup$ {...{ surveyQuestionsLength, currentQuestionFinished, surveyId: survey.id }} />
      </_body>
    </section>
  )
}

export default SurveyDo$
