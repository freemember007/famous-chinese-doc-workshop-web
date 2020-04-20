// framework
import React from 'react'
import Router from 'next/router'
import { useGet } from "restful-react"
import { useSearchParam } from 'react-use'

// component
import { NavBar, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Skeleton from 'react-loading-skeleton'
import { BulletList } from 'react-content-loader'
import { _title, _subTitle, _list } from '@/util/semantic-tags'

// fp
import { includes, isEmpty, random } from 'lodash/fp'
// import { pick } from 'ramda'
// import { match, matchPairs, ANY } from 'pampy'
// import { it, _ } from 'param.macro'

// util
import ensure from '@/util/ensure'
import { formatDateTimeM2 } from '@/util/date'

// props
export async function getServerSideProps({ query }) {
  // all acceptable and not nullable query params
  const {
    id          // 问卷结果id
  } = query
  ensure(id, '请求参数(问卷结果id)不能为空')

  return { props: { query } }
}

// nav
function Nav$() {
  return <NavBar mode="light" icon={<Icon type="left" />} onClick={ Router.back }>
    评测结果详情
  </NavBar>
}

// body
function Body$() {
  const id = useSearchParam('id')

  // useGet
  const { data, /*error*/ } = useGet({
    path        : 'common-biz/rest/survey_result',
    queryParams : {
      id     : 'eq.' + id,
      select : '*, survey(*, questions:question(*, options:option(*))), questionResults:question_result(*, question(*, options:option(*)))',
      'survey.question.order'        : 'order_num.desc',
      'survey.question.option.order' : 'order_num',
    },
    resolve     : res => res[0],
  })
  const survey_result = data || {}
  const survey = survey_result.survey || {}

  const QuestionListSkeleton$ = () => <>
    {[1,2,3,4,5].map(i=>
      <div key={i} className="my4">
        <div className={'w' + random(11, 12)}> <Skeleton height={24} /> </div>
        <BulletList/>
      </div>
    )}
  </>

  const QuestionList$ = () => {
    const RadioItem$ = questionResult => option =>
      <Radio.RadioItem
        key={ option.id }
        checked={ questionResult.option_id === option.id }
      >
        <div className="f3 gray">{ option.text }</div>
      </Radio.RadioItem>

    const CheckItem$ = questionResult => option =>
      <Checkbox.CheckboxItem
        key={ option.id }
        checked={ questionResult.option_ids |> includes(option.id) }
      >
        <div className="f3 gray">{ option.text }</div>
      </Checkbox.CheckboxItem>

    const InputItem$ = questionResult =>
      <TextareaItem
        autoHeight
        prefixListCls="f5"
        value={ questionResult.input }
      />

    return <>
      {/* @todo: 迭代questions */}
      {survey_result.questionResults.map((questionResult, index) => {
        const _question = questionResult.question
        return <_list key={index} className="my4">
          {/* 问题标题 */}
          <div className="py4 f2 bold"> {_question.title} </div>

          {/* 如果是单选 */}
          <List x-if={_question.type === 'radio'}>
            {_question.options.map(RadioItem$(questionResult))}
          </List>
          {/* 如果是多选 */}
          <List x-if={_question.type === 'check'}>
            {_question.options.map(CheckItem$(questionResult ))}
          </List>
          {/* 如果是开放问题 */}
          {_question.type === 'input' && InputItem$(questionResult) }

        </_list>
      })}
    </>
  }

  return (
    <div className="absolute t46 l0 r0 b0 pt4 px4 w12 bg-white">
      <_title className="py2 f1 tc"> {survey.title || <Skeleton/>} </_title>

      <_subTitle className="py2 w12 f4 gray __flex j-center">
        { isEmpty(survey) ? <div className="w6"><Skeleton/></div> :
          <div>
            <span>{'测试时间: ' + (survey_result.created_at |> formatDateTimeM2)}</span>
          </div>
        }
      </_subTitle>
      {isEmpty(survey_result.questionResults) ? <QuestionListSkeleton$ /> : <QuestionList$ />}

    </div>
  )
}

// main
function SurveyResult$({ query }) {
  return (
    <section>
      <Nav$ />
      <Body$ {...{ query }} />
    </section>
  )
}

export default SurveyResult$
