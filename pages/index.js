// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { Button, NavBar, Icon } from 'antd-mobile'
import { useGet } from "restful-react"
import { useAxios } from 'use-axios-client'
// import useSWR from 'swr'
import { DDYYAPI_BASE_URL } from '@/constant'
import agent from '@/util/request'
import { it/*, _*/ } from 'param.macro'
// import { matchPairs, ANY } from 'pampy'
// import { inc } from 'ramda'

export async function getServerSideProps() {
  const data = await agent.get('common-biz/rest/question').then(it.body)
  return { props: { data } }
}

// main
function Main(props) {

  const { data: surveys } = useGet({ path: 'common-biz/rest/survey' })
  // const { data: surveys } = useGet('common-biz/rest/survey')
  const { data: survey, error, loading } = useAxios({
    url: DDYYAPI_BASE_URL + 'common-biz/rest/survey?select=*,a',
  })
  // const { data: questions, error: err } = useSWR(
  //   'common-biz/rest/question',
  //   agent.get('common-biz/rest/question').then(res=>{
  //     console.log(res)
  //     // return res.body
  //   }, { initialData: []})
  // )

  // console.log({questions})

  const icon = pug`
    Icon(type="left")
  `

  return pug`
    NavBar(mode="light",leftContent="返回",icon=icon) 问卷列表

    section.p3
      each i,index in (surveys || [])
        p(key=index) #{i.title}

      if loading
        p loading...
      else if error
        - console.log({error})
        p #{error.toString()} ${error?.response?.data?.message}

      each i,index in (props.data || [])
        p(key=index) #{i.title}

      Button(type="primary") 提交
  `
}

export default Main
