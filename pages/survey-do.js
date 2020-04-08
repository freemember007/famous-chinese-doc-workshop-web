// framework
import React, { useState } from 'react'
import Router from 'next/router'
// import produce from 'immer'
// component
import { NavBar, Button, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import { SlideInRight } from 'animate-css-styled-components'
import Flex from 'styled-flex-component'
// fp
// import { without } from 'ramda'
// import { match, matchPairs, ANY } from 'pampy'
import { includes } from 'lodash/fp'
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { percent, concatOrWithout/*, transJsonArrayValueToPgArrayStr*/ } from '@/util/filters'
// import { _list, _item, _title, _step } from '@/util/semantic-tags'

export async function getServerSideProps({ /*req, res, */query}) {
  ensure(query?.id, '请求参数(问卷id)不能为空')
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id     : 'eq.' + query.id,
      select : '*, questions:question(*, options:option(*))'
    })
    .then(it.body)
  console.log(survey)
  return { props: { survey } }
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
      问卷评测
    </NavBar>
  )
}

function Body$({ survey }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const currentQuestion = survey.questions[currentQuestionIndex] || {}
  const [questionsResult, setQuestionsResult] = useState({})

  return (
    <article className="absolute t46 l0 r0 b0 px4 w12 bg-white">

      {/* 进度区 */}
      { (function Step$() {
        return <Flex alignCenter className="my4" >
          {/* 进度数 */}
          <div className="gray"> { [currentQuestionIndex + 1, survey.questions.length].join('/') } </div>
          {/* 进度条 */}
          <div className="flex1 relative ml4" style={{ height: '5px' }}>
            <div className="absolute h100 z2 round bg-primary" style={{ width: (currentQuestionIndex + 1)/survey.questions.length |> percent }}></div>
            <div className="absolute h100 z1 round w12 bg-gray"></div>
          </div>
        </Flex>
      })()}

      {/* 问题区 */}
      <SlideInRight duration="0.3s" delay="0.1s" >
        {/* 问题标题 */}
        <div className="py2 f2 bold"> {currentQuestion.title} </div>

        {/* 问题选项 */}
        <List className="f3">

          {/* 如果是单选 */}
          { currentQuestion.type === 'radio' &&
            currentQuestion.options.map(function RadioItem$(option) {
              return <Radio.RadioItem
                key={ option.id }
                checked={ questionsResult[currentQuestion.id] === option.id }
                onChange={ () => {
                  setQuestionsResult({
                    ...questionsResult,
                    [currentQuestion.id]: option.id,
                  })
                  // 单选选择后，自动跳到下一题
                  if(currentQuestionIndex < survey.questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1)
                } }>
                { option.text }
              </Radio.RadioItem>
            })
          }
          {/* 如果是多选 */}
          {currentQuestion.type === 'check' &&
            currentQuestion.options.map(function CheckItem$(option) {
              return <Checkbox.CheckboxItem
                key={ option.id }
                checked={ questionsResult[currentQuestion.id] |> includes(option.id) }
                onChange={ (/*target*/) => setQuestionsResult(
                  {
                    ...questionsResult,
                    [currentQuestion.id] : questionsResult[currentQuestion.id]
                      |> concatOrWithout(option.id)
                  }
                )}>
                { option.text }
              </Checkbox.CheckboxItem>
            })
          }
          {/* 如果是开放问题 */}
          { currentQuestion.type === 'input' &&
            <TextareaItem
              autoHeight
              placeholder="请输入..."
              labelNumber={ 5 }
              rows={ 3 }
              value={ questionsResult[currentQuestion.id] }
              onChange={ value => setQuestionsResult({
                ...questionsResult,
                [currentQuestion.id]: value,
              })}
            />
          }
        </List>

        {/* btnGroup */}
        { (function BtnGroup$() {
          return <Flex className="mt4">
            <Button
              x-if={ currentQuestionIndex > 0 }
              disabled={ !questionsResult[currentQuestion.id] }
              className="mx2 flex1"
              type="primary"
              onClick={ () => setCurrentQuestionIndex(currentQuestionIndex - 1) }
            >上一题</Button>
            <Button
              x-if={ currentQuestionIndex < survey.questions.length - 1 }
              disabled={ !questionsResult[currentQuestion.id] }
              className="mx2 flex1"
              type="primary"
              onClick={ () => setCurrentQuestionIndex(currentQuestionIndex + 1) }
            >下一题</Button>
            <Button
              x-if={ currentQuestionIndex === survey.questions.length - 1 }
              disabled={ !questionsResult[currentQuestion.id] }
              className="mx2 flex1"
              type="primary"
              onClick={ function saveSurveyResult() {
                agent.post('common-biz/rest/rpc/graph_insert_survey_result')
                  .send({
                    survey_id: 1,
                    questions_result_data: questionsResult,
                  })
                  .set({ Accept: 'application/vnd.pgrst.object+json' })
                  .then(res => res.ok
                    && Router.push({ pathname: '/survey-result', query: { id: res.body.id } }))
              } }
            >提交</Button>
          </Flex>
        })() }
      </SlideInRight>

    </article>
  )
}

export default Main$
