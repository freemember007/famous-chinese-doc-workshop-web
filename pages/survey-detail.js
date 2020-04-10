// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useGet } from "restful-react"
import { useSearchParam } from 'react-use'
// components
import { NavBar, Icon, Button } from 'antd-mobile'
import ContainerDimensions from 'react-container-dimensions'
import Image from 'react-shimmer'
import Skeleton from 'react-loading-skeleton'
// fp
import { isEmpty } from 'lodash/fp'
// import { it/*, _*/ } from 'param.macro'
// util
import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder } from '@/util/filters'
import { _title, _subTitle, _text } from '@/util/semantic-tags'

//- 导航
function Nav$() {
  return (
    <NavBar
      mode="light"
      leftContent="返回"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      问卷详情
    </NavBar>
  )
}

function Body$() {
  const { data, /*error*/ } = useGet({
    path        : 'common-biz/rest/survey',
    queryParams : { id: 'eq.' + useSearchParam('id') },
    resolve     : res => res[0],
  })
  const survey = data || {}
  return (
    <div className="absolute t46 l0 r0 b0 w12 bg-white">
      { (!process.browser || !survey.image) ? <Skeleton width={'100%'} height={200}/> :
        <ContainerDimensions>
          {({ width }) => (
            <Image src={survey.image |> imagePlaceholder } width={width} height={200} style={{ objectFit: 'cover' }} />
          )}
        </ContainerDimensions>
      }
      <div className="mt2 px4">
        <_title className="py2 f1 tc"> {survey.title || <Skeleton/>} </_title>

        <_subTitle className="py2 w12 f4 gray __flex j-center">
          { isEmpty(survey) ? <div className="w6"><Skeleton/></div> :
            <div>
              <span>{(survey.created_at |> formatDateTimeM2)}</span>
              <span className="ml2">{ survey.test_cnt + '人测过' }</span>
            </div>
          }
        </_subTitle>

        <_text className="dark lh2">
          { survey.intro || <Skeleton count={5} />}
        </_text>
        <Link href={{ pathname: '/survey-do', query: { id: survey.id }}}>
          <Button className="my4" type="primary" disabled={isEmpty(survey)}>开始测试</Button>
        </Link>
      </div>
    </div>
  )
}

// main
function SurveyDetail$() {
  return (
    <section>
      <Nav$ />
      <Body$ />
    </section>
  )
}

export default SurveyDetail$
