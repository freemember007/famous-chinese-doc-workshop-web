// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
// import { useSessionStorage } from 'react-use'
import useSessionstorage from "@rooks/use-sessionstorage"
// import { useGet } from "restful-react"

// components
import { NavBar, Icon } from 'antd-mobile'
import { ArrowIosForwardOutline as RightIcon } from '@styled-icons/evaicons-outline'
import Skeleton from 'react-loading-skeleton'

// fp
import { it/*, _*/ } from 'param.macro'

// util
import agent from '@/util/request'
import { imagePlaceholder, omit } from '@/util/filters'
import { _list, _item, _left, _right } from '@/util/semantic-tags'

// props
export async function getServerSideProps({ query }) {
  const surveys = await agent
    .get('common-biz/rest/survey')
    .then(it.body)
  return { props: { query, surveys } }
}

// nav
function Nav$() {
  return (
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      量表评测
    </NavBar>
  )
}

// body
function Body$({ surveys }) {
  const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle')

  return (
    <_list className="absolute t46 l0 r0 b0 px4 w100 bg-white">

      {(surveys || [{}, {}, {}, {}]).map((survey, index) =>
        <Link href={{ pathname: 'survey-detail', query: { pageTitle, id: survey.id }}} key={index}>
          <_item className=" py3 bg-white bb __flex j-between a-center">

            {/* 左侧内容 */}
            <_left className="flex1 __flex">
              { !survey.image ? <Skeleton width={80} height={80} /> :
                <img src={survey.image  |> imagePlaceholder} width={80} height={80} style={{ objectFit: 'cover' }} />
              }
              {/*<_wrap style={{ width: '80px', height: '80px', background: "#eee" }}>
                <Image src={survey.image |> imagePlaceholder} width={80} height={80} style={{ objectFit: 'cover' }} />
              </_wrap>*/}
              <_right className="ml2 flex1 __flex col j-between a-start">

                <div className="w12"> {(survey.title |> omit(36)) || <Skeleton />} </div>
                <div className="w4 f4 gray"> {survey.test_cnt !== undefined ? survey.test_cnt + '人测过' : <Skeleton />}</div>
              </_right>
            </_left>

            {/* 右箭头 */}
            <_right>
              <RightIcon className="gray-light" size="24" />
            </_right>

          </_item>
        </Link>
      )}

    </_list>
  )
}

// main
function SurveyList$({ surveys }) {
  return (
    <section>
      <Nav$ />
      <Body$ { ... { surveys } } />
    </section>
  )
}

export default SurveyList$
