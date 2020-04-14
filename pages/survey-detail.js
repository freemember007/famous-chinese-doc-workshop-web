// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'

// components
import { NavBar, Icon, Button } from 'antd-mobile'
import ContainerDimensions from 'react-container-dimensions'
import Image from 'react-shimmer'
import Skeleton from 'react-loading-skeleton'

// fp
import { isEmpty } from 'lodash/fp'
import { it/*, _*/ } from 'param.macro'

// util
import agent from '@/util/request'
import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder } from '@/util/filters'
import { _title, _subTitle, _text } from '@/util/semantic-tags'

// props
export async function getServerSideProps({ query }) {
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({ id: 'eq.' + query.id })
    .then(it.body)
  return { props: { survey, query } }
}

// nav
function Nav$() {
  return (
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      问卷详情
    </NavBar>
  )
}

// body
function Body$({ pageTitle, survey }) {
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
        <Link href={{ pathname: 'survey-do', query: { id: survey.id, pageTitle }}}>
          <Button className="my4" type="primary" disabled={isEmpty(survey)}>开始测试</Button>
        </Link>
      </div>
    </div>
  )
}

// main
function SurveyDetail$(props) {
  return (
    <section>
      <Nav$ />
      <Body$ {...props}/>
    </section>
  )
}

export default SurveyDetail$
