// 不自定义babel时，不需要显示引入react，@todo: 可用alias解决
import React from 'react'
import { Button, NavBar, Icon } from 'antd-mobile'
import { useGet } from "restful-react"
import agent from '@/util/request'
import { it/*, _*/ } from 'param.macro'
// import { matchPairs, ANY } from 'pampy'
// import { always } from 'ramda'

export async function getServerSideProps() {
  const questions = await agent.get('common-biz/rest/question').then(it.body)
  return { props: { questions } }
}

// main
function Main(props) {

  const { data: surveys, loading, error } = useGet({
    path        : 'common-biz/rest/survey',
    queryParams : {id: 'in.(1)'},
    resolve     : res => res,
    // requestOptions: { headers: { Accept: 'application/vnd.pgrst.object+json' } },
  })
  console.log({surveys})

  const icon = pug`
    Icon(type="left")
  `
  // return (<Get path='common-biz/rest/option'> {({options}) => <p>1</p>}</Get>)
  return pug`
    //- 导航
    NavBar(mode="light",leftContent="返回",icon=icon) 问卷列表

    section.p3
      //- 问卷列表
      section
        if loading
          p loading...
        else if error
          p #{error.toString()}
        else
          each i,index in (surveys || [])
            p(key=index) #{i.title}

      //- 问题列表
      each i,index in (props.questions || [])
        p(key=index) #{i.title}

      //- 选项列表
      //- Get(path="/option")
        //- each i,index in (options || [])
          p(key=index) #{i.text}

      //- 提交按钮
      Button(type="primary") 提交
  `
}

export default Main
