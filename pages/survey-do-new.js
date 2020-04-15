// framework
import React from 'react'
import Router from 'next/router'
import { useMutate } from "restful-react"
// import produce from 'immer'
import { useSessionStorage } from 'react-use'
import { createGlobalState } from 'react-hooks-global-state'

// component
import { NavBar, Button, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Flex from 'styled-flex-component'
import { CSSTransition } from 'react-transition-group'
// import ReactCSSTransitionReplace from 'react-css-transition-replace'

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
// import { _list, _item, _title, _step } from '@/util/semantic-tags'

// props
export const getServerSideProps = async ({ /*req, res, */query }) => {
  ensure(query?.id, '请求参数(问卷id)不能为空')
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                      : 'eq.' + query.id,
      select                  : '*, questions:question(*, options:option(*))',
      'question.order'        : 'order_num',
      'question.option.order' : 'order_num',
    })
    .then(it.body)
  // console.log(survey)
  return { props: { query, survey } }
}

// useGlobalState
const { useGlobalState } = createGlobalState({
  currentQuestionIndex    : 0,
  currentQuestionFinished : false,
  questionsResult         : {},
})

// nav
const Nav$ = ({ survey }) => {
  return (
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      {survey.title |> omit(16)}
    </NavBar>
  )
}

const Step$ = ({ survey }) => {
  const [currentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [currentQuestionFinished] = useGlobalState('currentQuestionFinished')
  return <Flex alignCenter className="my4 py2" >
    {/* 进度数 */}
    <div className="gray f2"> { [currentQuestionIndex + (currentQuestionFinished ? 1 : 0), survey.questions.length].join('/') } </div>
    {/* 进度条 */}
    <div className="flex1 relative ml4" style={{ height: '5px' }}>
      <div className="absolute h100 z2 round bg-primary" style={{
        width: (currentQuestionIndex + (currentQuestionFinished ? 1 : 0))/survey.questions.length |> percent
      }}></div>
      <div className="absolute h100 z1 round w12 bg-gray"></div>
    </div>
  </Flex>
}

const RadioItem$ = ({ survey, currentQuestion, option }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  const [currentQuestionFinished, setCurrentQuestionFinished] = useGlobalState('currentQuestionFinished')

  return <Radio.RadioItem
    checked={ questionsResult[currentQuestion.id] === option.id }
    onChange={ async () => {
      if(!currentQuestionFinished) setCurrentQuestionFinished(true)
      setQuestionsResult({
        ...questionsResult,
        [currentQuestion.id]: option.id,
      })
      await sleep(200)
      // 单选选择后，自动跳到下一题
      if(currentQuestionIndex < survey.questions.length - 1) {
        setCurrentQuestionFinished(false)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } }>
    <div className="f1 dark">{ option.text }</div>
  </Radio.RadioItem>
}

const CheckItem$ = ({ currentQuestion, option }) => {
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  const [currentQuestionFinished, setCurrentQuestionFinished] = useGlobalState('currentQuestionFinished')
  return <Checkbox.CheckboxItem
    key={ option.id }
    checked={questionsResult[currentQuestion.id] |> includes(option.id)}
    onChange={(/*target*/) => {
      if(!currentQuestionFinished) setCurrentQuestionFinished(true)
      setQuestionsResult({
        ...questionsResult,
        [currentQuestion.id] : questionsResult[currentQuestion.id]
          |> concatOrWithout(option.id)
      })
    }}>
    <div className="f1 dark">{ option.text }</div>
  </Checkbox.CheckboxItem>
}

const InputItem$ = ({ currentQuestion }) => {
  const [questionsResult, setQuestionsResult] = useGlobalState('questionsResult')
  const [currentQuestionFinished, setCurrentQuestionFinished] = useGlobalState('currentQuestionFinished')
  return (
    <TextareaItem
      autoHeight
      placeholder="请输入..."
      labelNumber={ 5 }
      rows={ 5 }
      value={ questionsResult[currentQuestion.id] }
      onChange={ value => {
        if(!currentQuestionFinished) setTimeout(setCurrentQuestionFinished(true), 3000)
        setQuestionsResult({
          ...questionsResult,
          [currentQuestion.id]: value,
        })
      }}
    />
  )
}

const Question$ = ({ survey, currentQuestion }) => {
  const [currentQuestionFinished ] = useGlobalState('currentQuestionFinished')
  return (
    <CSSTransition in={!currentQuestionFinished} timeout={200} classNames="fade-transiton">
      <div>
        {/* 问题标题 */}
        <div className="py4 f1 bold"> {currentQuestion.title} </div>

        {/* 问题内容 */}
        <List className="f3 py4">
          { currentQuestion.type === 'radio' && currentQuestion.options.map( option =>
            <RadioItem$ key={option.id} {...{ survey, currentQuestion, option }} />
          )}
          { currentQuestion.type === 'check' && currentQuestion.options.map( option =>
            <CheckItem$ key={option.id} {...{ currentQuestion, option }} />
          )}
          { currentQuestion.type === 'open' && <InputItem$  {...{ currentQuestion }} /> }
        </List>
      </div>
    </CSSTransition>
  )
}

const BtnGroup$ = ({ pageTitle, survey, currentQuestion }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const [, setCurrentQuestionFinished] = useGlobalState('currentQuestionFinished')
  const [questionsResult, ] = useGlobalState('questionsResult')

  const { mutate, loading, /*error*/ } = useMutate({
    verb : 'POST',
    path : 'common-biz/rest/rpc/graph_insert_survey_result',
  })
  const [ userInfo ] = useSessionStorage('ddyy-survey-userInfo', {})
  console.log({userInfo})

  const saveSurveyResult = () => {
    mutate({
      survey_id             : survey.id,
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
        setCurrentQuestionFinished(true) // 能往前翻一定是true，避免修改选项后状态被再次set
      }}
    >上一题</Button>
    <Button
      x-if={ currentQuestionIndex < survey.questions.length - 1 }
      disabled={ !questionsResult[currentQuestion.id] }
      className="mx2 flex1"
      type="primary"
      onClick={() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }}
    >下一题</Button>
    <Button
      x-if={ currentQuestionIndex === survey.questions.length - 1 }
      disabled={!questionsResult[currentQuestion.id] || loading}
      className="mx2 flex1"
      type="primary"
      loading={loading}
      onClick={ saveSurveyResult }
    >提交</Button>
  </Flex>
}

// Body
const Body$ = ({ pageTitle, survey }) => {
  const [currentQuestionIndex] = useGlobalState('currentQuestionIndex')
  const currentQuestion = survey.questions[currentQuestionIndex] || {}

  return (
    <div className="absolute t46 l0 r0 b0 px4 w12 bg-white">
      <Step$ {...{ survey }}/>
      <Question$ {...{ survey, currentQuestion }}/>
      <BtnGroup$ {...{ pageTitle, survey, currentQuestion }} />
    </div>
  )
}

// main
const SurveyDo$ = ({ query, pageTitle, survey }) => {
  return (
    <section>
      <Nav$ {...{ survey }} />
      <Body$ {...{ query, pageTitle, survey }} />
    </section>
  )
}

export default SurveyDo$
