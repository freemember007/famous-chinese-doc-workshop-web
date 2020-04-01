// framework
import React, { useState } from 'react'
import Router from 'next/router'
// component
import { NavBar, Icon } from 'antd-mobile'
import { SlideInRight } from 'animate-css-styled-components'
// fp
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { _list, _item, _title } from '@/util/semantic-tags'

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

  return (
    <article className="absolute t46 l0 r0 b0 px4 w100 bg-white">

      <_title className="py2 f2 tc"> {currentQuestion.title} </_title>

      <_list className="absolute t46 l0 r0 b0 px4 w100 bg-white">
        <SlideInRight duration="0.3s" delay="0.1s" >
          {(currentQuestion.options).map(option =>
            <_item className="py3 bg-white bb __flex j-between a-center">
              { option.text }

            </_item>
          )}

        </SlideInRight>
      </_list>


    </article>
  )
}

export default Main$
