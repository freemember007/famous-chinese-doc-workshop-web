// framework
import React from 'react'
import { FullWidthContainer, MainContainer, Right, List, Item, _title, _text, _date, Article, Row } from '@/components/_tags'
import ColumnHead from '@/components/ColumnHead'
import TwoColArticle from '@/components/TwoColArticle'
import OneColArticle from '@/components/OneColArticle'
// components
import Header from '@/components/Header'
import Nav from '@/components/Nav'
// fp
// import { join } from 'ramda'
// util
import { PLACEHOLDER_IMAGE } from '@/config/constant'

// props
export async function getServerSideProps({ req : { headers }, query }) {
  return { props: {} }
}


const HotNews = () => pug`
  section.mt2.p3.b.__flex.a-center
    div.mr4 最新动态
    List.flex1.f4.gray
      Item.__flex.j-between
        _title 关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
        _date 2019/05/01
      Item.__flex.j-between
        _title 关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
        _date 2019/05/01
`

const NavBtns = () => {
  return pug`
    List.mt2.__flex.wrap
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
      Item.w1-8.p2.__flex.column.a-center
        img.circle(width=60, height=60, src="" || PLACEHOLDER_IMAGE)
        div.mt2.f4 论文论著
  `
}

const RowWrapper = ({ children }) => {
  return pug`
    Row.my8.__flex #{children}
  `
}

const RowFirst = () => {
  return pug`
    RowWrapper
      TwoColArticle(
        colNameCn="名医风采",
        colNameEn="DOCTOR",
        imageUrl="",
        title="脂肪肝治疗讨论",
        summary="脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了~其实填充有很多方式，我觉得脂肪是最靠谱的，并不是人人都打得起玻尿酸，并不是人人都有钱！身为学生党的我们既要考虑效果，又要考虑性价比。再熬几年我也就毕业了，好想快点参加工作，那样我就可以肆无忌惮去整容，虽然现在也没人管着我...",
      )
      OneColArticle(
        colNameCn="工作室简介",
        colNameEn="WORKSHOP",
        imageUrl="",
        title="脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了~",
      )
  `
}

const DocList = () => {

}


// main
const Index = () => {
  return pug`
    Header
    Nav
    FullWidthContainer.py3.vw12.px2.__flex.j-center
      MainContainer.w8
        HotNews
        NavBtns
        RowFirst
  `
}

export default Index
