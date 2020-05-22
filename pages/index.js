// framework
import React from 'react'
// components
import { List, Item, Title, DateTime } from '@/components/tagName'
import MainContainer                   from '@/components/MainContainer'
import ColumnHead                      from '@/components/ColumnHead'
import TwoColArticle                   from '@/components/TwoColArticle'
import OneColArticle                   from '@/components/OneColArticle'
import ThreeColList                    from '@/components/ThreeColList'
import ThreeColAlbum                   from '@/components/ThreeColAlbum'
import Header                          from '@/components/Header'
import Footer                          from '@/components/footer'
import DivideVertical                  from '@/components/DivideVertical'
import DivideHorizen                   from '@/components/DivideHorizen'
// fp
// import { join } from 'ramda'
// util
import { IMAGE_PLACEHOLDER } from '@/config/constant'

// props
export async function getServerSideProps() {
  return { props: {} }
}

const ScrollSlide = () => {
  return pug`
    img.fit(width="100%", height=300, src="http://www.doctorwyj.com/img/banner.png")
    //- img(width="100%", height=300, src=IMAGE_PLACEHOLDER)
  `
}

const HotNews = () => pug`
  section.w12.p3.b.__flex.a-center
    div.mr4 最新动态
    List.flex1.f4.gray
      each num in [1,2]
        Item.w12.__flex.j-between(key=num)
          div.red.mr2 new!
          div.w12.__flex.j-between
            Title.gray.f4 关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
            DateTime.gray.f4 2020/05/03
`

const NavBtns = () => {
  return pug`
    List.w12.__flex.wrap
      each num in [1,2,3,4,5,6,7,8]
        Item.w1-8.p2.__flex.column.a-center
          img.circle(width=60, height=60, src="" || IMAGE_PLACEHOLDER)
          div.mt2.f4 论文论著
  `
}

const RowWrapper = ({ children }) => {
  return pug`
    section.__flex #{children}
  `
}

const RowFirst = () => {
  return pug`
    TwoColArticle(
      colNameCn="名医风采",
      colNameEn="DOCTOR",
      imageUrl="",
      title="脂肪肝治疗讨论",
      summary="脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了~其实填充有很多方式，我觉得脂肪是最靠谱的，并不是人人都打得起玻尿酸，并不是人人都有钱！身为学生党的我们既要考虑效果，又要考虑性价比。再熬几年我也就毕业了，好想快点参加工作，那样我就可以肆无忌惮去整容，虽然现在也没人管着我...",
    )
    DivideVertical(width=30)
    OneColArticle(
      colNameCn="工作室简介",
      colNameEn="WORKSHOP",
      imageUrl="",
      title="脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了~",
    )
  `
}

const DocTeam = () => {
  const colName = { colNameCn: '传承之路', colNameEn: 'TEAM' }
  const docs = [
    { name: '朱彩凤', title: '主任医师' },
    { name: '王永均', title: '主任医师' },
    { name: '张敏鸥 ', title: '主任医师' },
    { name: '朱彩凤', title: '主任医师' },
    { name: '王永均', title: '主任医师' },
    { name: '张敏鸥 ', title: '主任医师' },
  ]
  return pug`
    section.w12
      ColumnHead(...colName)
      List.__flex.j-between
        each doc, index in docs
          Item.w2.tc.lh2(key=index)
            img(width="100%", height=160, src=doc.imageUrl || IMAGE_PLACEHOLDER)
            div         #{doc.name}
            div.gray.f4 #{doc.title}
          if index !== docs.length -1
            DivideVertical(width=30)
  `
}

const DocSche = () => {
  const colName = { colNameCn: '专家排班', colNameEn: 'SCHEDULE' }
  const sches = [
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
  ]
  return pug`
    section.w8
      ColumnHead(...colName)
      table.table.table-striped.table-hover
        thead
          tr
            th 姓名
            th 职称
            th 出诊时间
        tbody.gray
          each sche, index in sches
            tr(key=index)
              td.dark #{sche.docName}
              td #{sche.docTitle}
              td #{sche.time}
  `
}

const Video = () => {
  const colName = { colNameCn: '视频资料', colNameEn: 'VIDEO' }
  return pug`
    ColumnHead(...colName, width="4")
      video.video(
        preload="auto"
        controls="controls"
        poster=IMAGE_PLACEHOLDER
        src="http://img.diandianys.com/lid8uKK2NKOy45WvuGoScUKlsajQ")
      div.f4 脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了
  `
}

// main
const Index = () => {
  return pug`
    Header
    ScrollSlide
    MainContainer
      RowWrapper
        HotNews
      DivideHorizen(height=10)
      RowWrapper
        NavBtns
      DivideHorizen
      RowWrapper
        RowFirst
      DivideHorizen
      RowWrapper
        DocTeam
      DivideHorizen
      RowWrapper
        DocSche
        DivideVertical
        Video
      DivideHorizen
      RowWrapper
        ThreeColList(colNameCn="医案医话", colNameEn="CASE")
      DivideHorizen
      RowWrapper
        ThreeColAlbum(colNameCn="工作室环境", colNameEn="ENVIORMENT")
    DivideHorizen
    Footer
  `
}

export default Index
