// framework
import React, { Fragment }             from 'react' // eslint-disable-line
// components
import { List, Item, Title, Article, Right, Describe, DateTime } from '@/components/tagName' // eslint-disable-line
import MainContainer                   from '@/components/MainContainer'
import Header                          from '@/components/Header'
import Footer                          from '@/components/footer'
import DivideVertical                  from '@/components/DivideVertical'
import DivideHorizen                   from '@/components/DivideHorizen'
// fp
import { map, omit, always, pick, tap, keys, evolve, head, assoc, dissocPath, defaultTo } from 'ramda' // eslint-disable-line
import { dissocDotPath, defaultToEmptyArray, defaultToEmptyObject } from 'ramda-extension'
import { it, _ }                       from 'param.macro' // eslint-disable-line
import { matchPairs, ANY }             from 'pampy' // eslint-disable-line
// util
import { IMAGE_PLACEHOLDER }           from '@/config/constant'
import agent                           from '@/util/request'
import { inspect, groupObjectArrayByAttrSumEqual } from '@/util/filters' // eslint-disable-line
import { formatDateTime }              from '@/util/date'

// props
export const getServerSideProps = async ({ res }) => { // eslint-disable-line
  const hos = await agent
    .get('hos')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                             : 'eq.' + 1,
      select                         : '*, announcement:forum(*, posts:post(id, title, created_at)), homeCols:home_col(*, forum(*, posts:post(id, title), topPost:post(*)))',
      'announcement.id'              : 'eq.' + 6,
      'announcement.posts.order'     : 'created_at.desc',
      'homeCols.order'               : 'order_num',
      'homeCols.forum.posts.order'   : 'is_top,created_at.desc',
      'homeCols.forum.topPost.order' : 'is_top,created_at.desc',
      'homeCols.forum.topPost.limit' : 1,
      'homeCols.forum.posts.offset'  : 1,
    })
    .then(it.body)
    .then(evolve({ announcement: defaultToEmptyArray & head & defaultToEmptyObject }))
    .then(evolve({ homeCols: map(evolve({ forum: defaultToEmptyObject })) }))
    // 考虑加个计算字段home_col.top_post，避免上面的复杂查询及这里的手动转换
    .then(evolve({ homeCols: map(homeCol => assoc('post', homeCol?.forum?.topPost?.[0] ?? {}, homeCol)) }))
    .then(evolve({ homeCols: map(homeCol => dissocDotPath('forum.topPost', homeCol)) }))
    // .then(res.end(_ |> inspect), res.end(_ |> inspect))
  return { props: { hos } }
}

// 全屏轮播大图
const ScrollSlide = ({ banners }) => {
  return <>
    <img className="fit" width="100%" height="300" src={banners?.[0]?.image} />
  </>
}

// 最新动态
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

// mobile端导航button
const NavBtns = () => { // eslint-disable-line
  return <>
    <List className="w12 __flex wrap">
      <Item x-for={num in [1,2,3,4,5,6,7,8]} key={num}>
        <img className="circle" width={60} height={60} src={IMAGE_PLACEHOLDER}/>
        <div className="mt2 f4">论文论著</div>
      </Item>
    </List>
  </>
}

// 医生列表
const DocShow = () => {
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
      {/* <ColWrapper {...colName} /> */}
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

// 医生排班
const DocSche = () => {
  const sches = [
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
    { docName: '杨少山', docTitle: '副主任医师', time: '周一上午，周二下午' },
  ]
  return <>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>姓名</th>
          <th>职称</th>
          <th>出诊时间</th>
        </tr>
      </thead>
      <tbody className="gray">
        <tr x-for={(sche, index) in sches} key={index}>
          <td className="dark">{sche.docName}</td>
          <td>{sche.docTitle}</td>
          <td>{sche.time}</td>
        </tr>
      </tbody>
    </table>
  </>
}

const Video = () => {
  const colName = { colNameCn: '视频资料', colNameEn: 'VIDEO' }
  return <>
    <ColWrapper {...colName} width={1}>
      <video className="video"
        preload="auto"
        controls="controls"
        poster={IMAGE_PLACEHOLDER}
        src="http://img.diandianys.com/lid8uKK2NKOy45WvuGoScUKlsajQ"/>
      <div className="f4">脂肪填充真的是一个神奇的手术，这才半个月，就已经恢复这么好了</div>
    </ColWrapper>
  </>
}

const DynamicCol = ({ homeCol }) => {
  const { type, forum, post, col_cnt } = homeCol
  const colNames = matchPairs(type,
    ['docShow' , always({ colNameCn:  '传承之路', colNameEn: 'TEAM' })],
    ['docSche' , always({ colNameCn:  '医生排班', colNameEn: 'SCHEDULE' })],
    [ANY       , always({ colNameCn:  forum.name, colNameEn: forum.name_en })],
  )
  const Col = matchPairs(homeCol,
    [{ type: 'docShow' }                   , always(<DocShow />)],
    [{ type: 'docSche' }                   , always(<DocSche />)],
    [{ type: 'album', col_cnt: 3 }         , always(<ThreeColAlbum {...{ forum }}/>)],
    [{ type: 'normal', col_cnt: 3 }        , always(<ThreeColList  {...{ forum, post }}/>)],
    [{ col_cnt: 2 }                        , always(<TwoColArticle {...{ forum, post }}/>)],
    [{ col_cnt: 1 }                        , always(<OneColArticle {...{ forum, post }}/>)],
    [ANY                                   , always('')],
  )
  return <ColWrapper {...colNames} colCnt={col_cnt}>
    {Col}
  </ColWrapper>
}

const DynamicRow = ({ homeCols }) => {
  const groupedHomeCols = homeCols |> groupObjectArrayByAttrSumEqual('col_cnt', 3)
  // console.log(groupedHomeCols)
  return <>
    <RowWrapper x-for={(group, index) in groupedHomeCols} key={index}>
      <Fragment x-for={(homeCol, index) in group} key={index}>
        <DynamicCol {...{ homeCol }}/>
        {group.length > 1 && index < group.length - 1 && <DivideVertical />}
      </Fragment>
    </RowWrapper>
  </>
}

// functions
function RowWrapper({ children }) {
  return <>
    <DivideHorizen/>
    <section className="__flex">
      {children}
    </section>
  </>
}
function ColWrapper({ colNameCn, colNameEn, colCnt, children }) {
  const width = matchPairs(colCnt, [1, '33.33%'], [2, '66.66%'], [3, '100%'], [ANY, '100%'])
  return <>
    <section style={{ width }}>
      <section className="mb4 pl4 bl bw4 b-primary">
        <span>{colNameCn}</span>
        <span className="mx1 gray">/</span>
        <span className="gray">{colNameEn}</span>
      </section>
      {children}
    </section>
  </>
}
function ThreeColAlbum ({ forum }) {
  return <>
    <List className="__flex j-between">
      <Fragment x-for={(post, index) in forum.posts}  key={index}>
        <Item className="w3">
          <img className="w12" height={300} src={post.image || IMAGE_PLACEHOLDER}/>
        </Item>
        {(index < 4) && <DivideVertical/>}
      </Fragment>
    </List>
  </>
}
function ThreeColList ({ forum, post }) {
  return <>
    <section className="w12 __flex j-between">
      <img className="w5" height={300} src={post.image || IMAGE_PLACEHOLDER}/>
      <DivideVertical/>
      <section className="w7">
        <Title>{post.title}</Title>
        <Describe className="my2 gray f4 lh15 indent t-justify">{post.text}</Describe>
        <List>
          <Item className="w12 __flex j-between" x-for={(post, index) in forum.posts}  key={index}>
            {/* <pre>{index}</pre> */}
            {/* <pre>{post.id}</pre> */}
            <div className="red mr2">new!</div>
            <div className="w12 __flex j-between">
              <Title className="gray f4">关于举办2019年“中医护理技术在痛症中的应用学习班”的通知</Title>
              <DateTime className="gray f4">2020/05/03</DateTime>
            </div>
          </Item>
        </List>
      </section>
    </section>
  </>
}

function TwoColArticle ({ forum, post }) {
  return <>
    <Article className="__flex">
      <img width={320} height={200} src={post.image || IMAGE_PLACEHOLDER}/>
      <Right className="ml2 flex1 __flex column">
        <Title className="tc">{post.title}</Title>
        <div className="mt2 gray f4 t-justify indent2">{post.text}</div>
      </Right>
    </Article>
  </>
}

function OneColArticle({ forum, post }) {
  return <>
    <Article>
      <img width="100%" height={160} src={post.image || IMAGE_PLACEHOLDER}/>
      <div className="mt2 gray f4 t-justify indent">{post.title}</div>
    </Article>
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
    {/* 主体 */}
    <MainContainer>
      {/*<pre>{announcement | inspect}</pre>*/}
      <HotNews {...{ announcement }}/>
      {/* <RowWrapper> */}
      {/*   <NavBtns /> */}
      {/* </RowWrapper> */}
      {/* <DivideHorizen /> */}
      <DynamicRow {...{ homeCols }}/>
    </MainContainer>
    {/* 底部 */}
    <DivideHorizen />
    <Footer {...{ hosName, friendLinks }}/>
  </>
}

export default Index
