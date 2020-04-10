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
import { it/*, _*/ } from 'param.macro'
// util
import agent from '@/util/request'
import { formatDateTimeM2 } from '@/util/date'
import { imagePlaceholder } from '@/util/filters'
import { _title, _subTitle, _text } from '@/util/semantic-tags'

export async function getServerSideProps({ /*req, res, */query}) {
  const survey = await agent
    .get('common-biz/rest/survey')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({ id: 'eq.' + query.id })
    .then(it.body)
  return { props: { query, survey } }
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
      问卷详情
    </NavBar>
  )
}

function Body$({ survey }) {
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
        <_title className="py2 f1 tc"> {survey.title} </_title>

        <_subTitle className="py2 f4 gray __flex j-center">
          <div> {survey.created_at |> formatDateTimeM2}</div>
          <div className="ml2"> {'23452人测过'}</div>
        </_subTitle>

        <_text className="dark lh2">
          { survey.intro }
        </_text>
        <Link href={{ pathname: '/survey-do', query: { id: survey.id }}}>
          <Button className="my4" type="primary" >开始测试</Button>
        </Link>
      </div>
    </div>
  )
}

export default Main$
