// framework
import React, { Fragment }             from 'react' // eslint-disable-line
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
import { map, omit, pick, tap, keys, evolve, head } from 'ramda' // eslint-disable-line
import { it, _ }                       from 'param.macro' // eslint-disable-line
import { matchPairs, ANY }             from 'pampy' // eslint-disable-line
import { match, when, otherwise }      from 'mch' // eslint-disable-line
// util
import { IMAGE_PLACEHOLDER }           from '@/config/constant'
import agent                           from '@/util/request'
import { inspect, groupObjectArrayByAttrSumEqual } from '@/util/filters' // eslint-disable-line
import { formatDateTime }             from '@/util/date'

// props
export const getServerSideProps = async (/*{ res }*/) => {
  const hos = await agent
    .get('hos')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                          : 'eq.' + 1,
      select                      : '*, announcement:forum(*, posts:post(id, title, created_at)), homeCols:home_col(*, forum(*, posts:post(id, title)), post(*))',
      'forum.id'                  : 'eq.' + 6,
      'forum.order'               : 'created_at',
      'forum.post.order'          : 'created_at.desc',
      'home_col.order'            : 'order_num',
      'home_col.forum.post.order' : 'created_at.desc',
    })
    .then(it.body)
    .then(evolve({ announcement: head }))
    // .then(tap(console.log(_)))
    // .catch(err => res.end(err.response?.text))
  return { props: { hos } }
}

const ScrollSlide = ({ banners }) => {
  return <>
    <img className="fit" width="100%" height="300" src={banners?.[0]?.image} />
  </>
}

const HotNews = ({ announcement }) => {
  return <>
    <section className="w12 p3 b __flex a-center">
      <div className="mr4"> 最新动态 </div>
      <List className="flex1 f4 gray">
        <Item x-for={post in announcement.posts} className="w12 __flex j-between" key={post.id}>
          <div className="mr2 red"> new! </div>
          <div className="w12 __flex j-between">
            <Title className="gray f4"> {post.title} </Title>
            <DateTime className="gray f4"> {post.created_at |> formatDateTime} </DateTime>
          </div>
        </Item> {/* aaa */}
      </List>
    </section>
  </>
}
const NavBtns = () => {
  return <>
    <List className="w12 __flex wrap">
      <Item x-for={num in [1,2,3,4,5,6,7,8]} key={num}>
        <img className="circle" width={60} height={60} src={IMAGE_PLACEHOLDER}/>
        <div className="mt2 f4">论文论著</div>
      </Item>
    </List>
  </>
}

const RowWrapper = ({ children }) => {
  return <>
    <DivideHorizen/>
    <section className="__flex">
      {children}
    </section>
  </>
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

const DocShow = () => {
  const colName = { colNameCn: '传承之路', colNameEn: 'TEAM' }
  const docs = [
    { name: '朱彩凤', title: '主任医师' },
    { name: '王永均', title: '主任医师' },
    { name: '张敏鸥 ', title: '主任医师' },
    { name: '朱彩凤', title: '主任医师' },
    { name: '王永均', title: '主任医师' },
    { name: '张敏鸥 ', title: '主任医师' },
  ]

  return <>
    <section className="w12">
      <ColumnHead {...colName} />
      <List className="__flex j-between">
        <Fragment x-for={(doc, index) in docs}  key={index}>
          <Item className="w2 tc lh2">
            <img width="100%" height={160} src={doc.imageUrl || IMAGE_PLACEHOLDER} />
            <div>{doc.name}</div>
            <div className="gray f4">{doc.title}</div>
          </Item>
          {/* <DivideVertical width={30} /> */}
          {(index < docs.length - 1 ) && <DivideVertical width={30} />}
        </Fragment>
      </List>
    </section>
  </>
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

const DynamicCol = ({ homeCol }) => {
  return matchPairs(homeCol,
    [{ type: 'docShow' }                   , () => <DocShow /> ],
    [{ type: 'docSche' }                   , () => <DocSche /> ],
    [{ type: 'album' , col_cnt: 3 }        , () => <ThreeColAlbum /> ],
    [{ type: 'normal', col_cnt: 3 }        , () => <ThreeColList /> ],
    [{ post_id: Number, col_cnt: 2 }       , () => <TwoColArticle /> ],
    [{ post_id: Number, col_cnt: 1 }       , () => <OneColArticle /> ],
    [ANY                                   , () => '' ],
  )
}

const DynamicColList = ({ homeCols }) => {
  const homeColsGroupByRow = homeCols |> groupObjectArrayByAttrSumEqual('col_cnt', 3)
  // console.log(homeColsGroupByRow)
  return <>
    <RowWrapper x-for={(_homeCols, index) in homeColsGroupByRow} key={index}>
      <DynamicCol x-for={homeCol in _homeCols} key={homeCol.id} {...{ homeCol }}/>
    </RowWrapper>
  </>
}

// main
const Index = ({ hos }) => {
  const { name: hosName, logo: hosLogo, announcement, links: friendLinks, banners, homeCols } = hos
  return <>
    {/* 头部 */}
    <Header {...{ hosName, hosLogo }} />

    {/* 大图 */}
    <ScrollSlide {...{ banners }} />

    {/* <pre> {hos |> omit(['homeCols']) |> inspect} </pre> */}

    {/* 主体 */}
    <MainContainer>
      {/*<pre>{announcement | inspect}</pre>*/}
      <HotNews {...{ announcement }}/>
      <DynamicColList {...{ homeCols }}/>
    </MainContainer>

    {/* 主体 */}
    <MainContainer>
      <RowWrapper>
        {/*<HotNews {...{ announcement }}/>*/}
      </RowWrapper>
      <DivideHorizen height="10" />

      {/* <RowWrapper> */}
      {/*   <NavBtns /> */}
      {/* </RowWrapper> */}
      {/* <DivideHorizen /> */}

      <RowWrapper>
        <RowFirst />
      </RowWrapper>
      <DivideHorizen />

      <RowWrapper>
        <DocShow />
      </RowWrapper>
      <DivideHorizen />

      <RowWrapper>
        <DocSche />
        <DivideVertical />
        <Video />
      </RowWrapper>
      <DivideHorizen />

      <RowWrapper>
        <ThreeColList colNameCn="医案医话" colNameEn="CASE" />
      </RowWrapper>
      <DivideHorizen />

      <RowWrapper>
        <ThreeColAlbum colNameCn="工作室环境" colNameEn="ENVIORMENT" />
      </RowWrapper>
    </MainContainer>

    {/* 底部 */}
    <DivideHorizen />
    <Footer {...{ hosName, friendLinks }}/>
  </>
}

export default Index
