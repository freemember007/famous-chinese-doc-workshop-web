// framework
import React, { useState } from 'react'
import Router from 'next/router'
import { useMutate } from "restful-react"
// import produce from 'immer'
import { useSessionStorage } from 'react-use'

// component
import { NavBar, Button, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Flex from 'styled-flex-component'

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
export async function getServerSideProps({ /*req, res, */query}) {
  ensure(query?.id, '请求参数(问卷id)不能为空')
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                      : 'eq.' + query.id,
      select                  : '*, questions:question(*, options:option(*))',
      'question.option.order' : 'order_num',
    })
    .then(it.body)
  // console.log(survey)
  return { props: { survey, query } }
}

// nav
function Nav$({ survey }) {
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

// body
function Body$({ pageTitle, survey, query }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestionFinished, setCurrentQuestionFinished] = useState(false) // @todo: set使用时不严谨
  const [questionsResult, setQuestionsResult] = useState({})
  const currentQuestion = survey.questions[currentQuestionIndex] || {}

  function Step$() {
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

  function RadioItem$(option) {
    return <Radio.RadioItem
      key={ option.id }
      checked={ questionsResult[currentQuestion.id] === option.id }
      onChange={ async () => {
        setCurrentQuestionFinished(true)
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

  function CheckItem$(option) {
    return <Checkbox.CheckboxItem
      key={ option.id }
      checked={questionsResult[currentQuestion.id] |> includes(option.id)}
      onChange={(/*target*/) => {
        setCurrentQuestionFinished(true)
        setQuestionsResult({
          ...questionsResult,
          [currentQuestion.id] : questionsResult[currentQuestion.id]
            |> concatOrWithout(option.id)
        })
      }}>
      { option.text }
    </Checkbox.CheckboxItem>
  }

  function BtnGroup$() {
    const { mutate, loading, /*error*/ } = useMutate({
      verb : 'POST',
      path : 'common-biz/rest/rpc/graph_insert_survey_result',
    })
    const [ userInfo ] = useSessionStorage('ddyy-survey-userInfo', {})
    console.log({userInfo})

    return <Flex className="mt4">
      <Button
        x-if={ currentQuestionIndex > 0 }
        disabled={loading}
        className="mx2 flex1"
        type="primary"
        onClick={() => {
          // setCurrentQuestionFinished(false)
          setCurrentQuestionIndex(currentQuestionIndex - 1)
        }}
      >上一题</Button>
      <Button
        x-if={ currentQuestionIndex < survey.questions.length - 1 }
        disabled={ !questionsResult[currentQuestion.id] }
        className="mx2 flex1"
        type="primary"
        onClick={() => {
          setCurrentQuestionFinished(false)
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }}
      >下一题</Button>
      <Button
        x-if={ currentQuestionIndex === survey.questions.length - 1 }
        disabled={!questionsResult[currentQuestion.id] || loading}
        className="mx2 flex1"
        type="primary"
        loading={loading}
        onClick={function saveSurveyResult() {
          mutate({
            survey_id             : query.id,
            hos_id                : userInfo.hos_id,
            pat_id                : userInfo.pat_id,
            questions_result_data : questionsResult,
          }).then(res => Router.replace({ pathname: '/ddyy-common-business-react/survey-explain', query: { pageTitle, id: res?.[0]?.id } }))
        }}
      >提交</Button>
    </Flex>
  }

  return (
    <div className="absolute t46 l0 r0 b0 px4 w12 bg-white">

      <Step$ />

      {/* 问题区 */}
      {/* 问题标题 */}
      <div className="py4 f1 bold"> {currentQuestion.title} </div>

      {/* 问题选项 */}
      <List className="f3 py4">

        {/* 如果是单选 */}
        { currentQuestion.type === 'radio' &&
          currentQuestion.options.map(RadioItem$)
        }
        {/* 如果是多选 */}
        {currentQuestion.type === 'check' &&
          currentQuestion.options.map(CheckItem$)
        }
        {/* 如果是开放问题 */}
        { currentQuestion.type === 'input' &&
          <TextareaItem
            autoHeight
            placeholder="请输入..."
            labelNumber={ 5 }
            rows={ 3 }
            value={ questionsResult[currentQuestion.id] }
            onChange={ value => {
              setCurrentQuestionFinished(true)
              setQuestionsResult({
                ...questionsResult,
                [currentQuestion.id]: value,
              })
            }}
          />
        }
      </List>

      <BtnGroup$ />

    </div>
  )
}

// main
function SurveyDo$(props) {
  return (
    <section>
      <Nav$ {...props} />
      <Body$ {...props} />
    </section>
  )
}

export default SurveyDo$
