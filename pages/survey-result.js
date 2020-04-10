// framework
import React, { useEffect } from 'react'
import Router from 'next/router'
import { useGet } from "restful-react"
import { useSearchParam } from 'react-use'
// import { useUrlSearchParams } from "use-url-search-params"

// component
import { NavBar, Icon, List, Checkbox, Radio, TextareaItem } from 'antd-mobile'
import Skeleton from 'react-loading-skeleton'
import { BulletList } from 'react-content-loader'
import { _title, _subTitle, _list } from '@/util/semantic-tags'

// fp
import { includes, isEmpty, random } from 'lodash/fp'
// import { without } from 'ramda'
// import { match, matchPairs, ANY } from 'pampy'
// import { it, _ } from 'param.macro'

// util
import ensure from '@/util/ensure'
import { formatDateTimeM2 } from '@/util/date'

//- 导航
function Nav$() {
  return <NavBar mode="light" leftContent="返回" icon={<Icon type="left" />} onClick={ Router.back }>
    问卷评测结果
  </NavBar>
}

function Body$() {
  // 该库导致需多次返回才可返回
  // const [ params/*, setParams*/ ] = useUrlSearchParams({ id: 1 /*defaultValue*/})
  const id = useSearchParam('id')

  useEffect(() => {
    ensure(id, '请求参数(问卷结果id)不能为空')
  }, [])

  // useGet
  const { data, /*error*/ } = useGet({
    path        : 'common-biz/rest/survey_result',
    queryParams : {
      id     : 'eq.' + id,
      select : '*, survey(*, questions:question(*, options:option(*))), questionResults:question_result(*, question(*, options:option(*)))',
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

    return <div>
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
    </div>
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
function SurveyResult$() {
  return (
    <section>
      <Nav$ />
      <Body$ />
    </section>
  )
}

export default SurveyResult$
