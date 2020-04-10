// framework
import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { useGet } from "restful-react"
// components
import { NavBar, Icon } from 'antd-mobile'
import { SlideInRight } from 'animate-css-styled-components'
import { ArrowIosForwardOutline as RightIcon } from '@styled-icons/evaicons-outline'
import Image from 'react-shimmer'
import Skeleton from 'react-loading-skeleton'
// fp
// import { it/*, _*/ } from 'param.macro'
// util
import { imagePlaceholder, omit } from '@/util/filters'
import { _list, _item, _left, _right, _wrap } from '@/util/semantic-tags'

//- 导航
function Nav$() {
  return (
    <NavBar
      mode="light"
      leftContent="返回"
      icon={<Icon type="left" />}
      onClick={ Router.back }
    >
      问卷列表
    </NavBar>
  )
}

function Body$() {
  const { data: surveys, /*error*/ } = useGet({
    path        : 'common-biz/rest/survey',
    resolve     : res => res,
  })

  return (
    <_list className="absolute t46 l0 r0 b0 px4 w100 bg-white">
      <SlideInRight duration="0.3s" delay="0.1s" >

        {(surveys || [{}, {}, {}, {}]).map((survey, index) =>
          <Link href={{ pathname: './survey-detail', query: { id: survey.id }}} key={index}>
            <_item className=" py3 bg-white bb __flex j-between a-center">

              {/* 左侧内容 */}
              <_left className="flex1 __flex">
                <_wrap style={{ width: '80px', height: '80px', background: "#eee" }}>
                  <Image src={survey.image |> imagePlaceholder} width={80} height={80} style={{ objectFit: 'cover' }} />
                </_wrap>
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

      </SlideInRight>
    </_list>
  )
}

// main
function SurveyList$() {
  return (
    <section>
      <Nav$ />
      <Body$ />
    </section>
  )
}

export default SurveyList$
