import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { NavBar, Icon } from 'antd-mobile'
import { SlideInRight } from 'animate-css-styled-components'
import { ArrowIosForwardOutline as RightIcon } from '@styled-icons/evaicons-outline'
import { it/*, _*/ } from 'param.macro'
import agent from '@/util/request'
// import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder, omit } from '@/util/filters'
import { _list, _item, _left, _right } from '@/util/semantic-tags'

export async function getServerSideProps() {
  return { props: {
    surveys: await agent.get('common-biz/rest/survey').then(it.body)
  } }
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
      问卷列表
    </NavBar>
  )
}

function Body$(props) {
  return (
    <_list className="absolute t46 l0 r0 b0 px4 w100 bg-white">
      <SlideInRight duration="0.3s" delay="0.1s" >

        {props.surveys.map(survey =>
          <Link href={{ pathname: '/survey-detail', query: { id: survey.id }}} key={survey.id}>
            <_item className="py3 bg-white bb __flex j-between a-center">

              {/* 左侧内容 */}
              <_left className="__flex">
                <img width="80px" height="80px" src={survey.image |> imagePlaceholder} />
                <_right className="ml2 flex1 __flex col j-between a-start">
                  <div> { survey.title |> omit(36) } </div>
                  <div className="f4 gray"> {'23452人测过'}</div>
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

export default Main$
