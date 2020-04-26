// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
// import useSessionstorage from "@rooks/use-sessionstorage"
// import Cookies from 'js-cookie'
// components
import { NavBar, Icon } from 'antd-mobile'
import { ArrowIosForwardOutline as RightIcon } from '@styled-icons/evaicons-outline'
import Skeleton from 'react-loading-skeleton'
// fp
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import ensure from '@/util/ensure'
import { imagePlaceholder, omit } from '@/util/filters'
import { _list, _item, _left, _right } from '@/util/semantic-tags'

// props
export const getServerSideProps = async ({ query }) => {
  // all acceptable page query params
  const {
    /* eslint-disable */
    app_id,    // 应用id查询条件 @todo: 使用本地session?
    hos_id,    // 医院id查询条件
  } = query

  // ensure
  ensure(app_id && hos_id, 'query参数app_id/hos_id不可为空')

  // fetch
  const surveys = await agent
    .get('common-biz/rest/survey')
    .query({
      hos_id : 'eq.' + hos_id
    })
    .then(it.body)
  return { props: { query, surveys } }
}

// nav
const Nav$ = () => {
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
const Body$ = ({ surveys }) => {
  // const [pageTitle] = useSessionstorage('ddyy-survey-pageTitle')
  // const pageTitle = Cookies.get('ddyy-survey-pageTitle')

  return (
    <_list className="absolute t46 l0 r0 b0 px4 w100 bg-white">

      {(surveys || [{}, {}, {}, {}]).map((survey, index) =>
        <Link href={{ pathname: 'survey-detail', query: { id: survey.id }}} key={index}>
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
