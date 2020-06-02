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
import { tail, test, map, omit, always, pick, tap, keys, evolve, head, assoc, dissocPath, defaultTo, take } from 'ramda' // eslint-disable-line
import { dissocDotPath, defaultToEmptyArray, defaultToEmptyObject } from 'ramda-extension'
import { it, _ }                       from 'param.macro' // eslint-disable-line
import { matchPairs, ANY }             from 'pampy' // eslint-disable-line
// util
import { IMAGE_PLACEHOLDER }           from '@/config/constant'
import agent                           from '@/util/request'
import { inspect, pairedByAttrSumEqualNum } from '@/util/filters' // eslint-disable-line
import { formatDateTimeM, formatDate } from '@/util/date'

// props
export const getServerSideProps = async ({ req, res }) => { // eslint-disable-line
  const userAgent = req.headers['user-agent']
  const IS_MOBILE = test(/Android|OS [0-9_]+ like Mac OS X|Windows Phone/i, userAgent)
  // res.end(IS_MOBILE |> inspect)
  const hos = await agent
    .get('hos')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id                             : 'eq.' + 1,
      select                         : '*, navMenus:nav_menu(*), friendLinks:link(*), docs:doc(*), announcement:forum(*, posts:post(id, title, created_at)), homeCols:home_col(*, forum(*, posts:post(id, title, image, video, file), topPost:post(*)))',
      'announcement.id'              : 'eq.' + 6,
      'announcement.posts.order'     : 'created_at.desc',
      'homeCols.order'               : 'order_num',
      'homeCols.forum.posts.order'   : 'is_top,created_at.desc',
      'homeCols.forum.topPost.order' : 'is_top,created_at.desc',
      'homeCols.forum.topPost.limit' : 1,
      // 'homeCols.forum.posts.offset'  : 1, // 由具体栏目决定
    })
    .then(it.body)
    .then(evolve({ announcement: defaultToEmptyArray & head & defaultToEmptyObject }))
    .then(evolve({ homeCols: map(evolve({ forum: defaultToEmptyObject })) }))
    // 考虑加个计算字段home_col.top_post，避免上面的复杂查询及这里的手动转换
    .then(evolve({ homeCols: map(homeCol => assoc('post', homeCol?.forum?.topPost?.[0] ?? {}, homeCol)) }))
    .then(evolve({ homeCols: map(homeCol => dissocDotPath('forum.topPost', homeCol)) }))
    .then(evolve({ homeCols: map(evolve({ col_cnt: col_cnt => IS_MOBILE ? 1 : col_cnt })) }))
    // .then(res.end(_ |> pick(['homeCols']) |> inspect), res.end(_ |> inspect))
  return { props: { hos, IS_MOBILE } }
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
      <div className="mr4 hide-sm"> 最新动态 </div>
      <List className="flex1 f4 gray">
        <Item x-for={post in announcement.posts} className="w12 __flex j-between" key={post.id}>
          <div className="mr2 red hide-sm"> new! </div>
          <div className="mr2 red show-sm"> • </div>
          <div className="w12 __flex j-between">
            <Title className="gray f4">{post.title}</Title>
            <DateTime className="gray f4 hide-sm">{post.created_at |> formatDate}</DateTime>
          </div>
        </Item> {/* aaa */}
      </List>
    </section>
  </>
}

// mobile端导航button
const NavBtns = ({ navMenus }) => { // eslint-disable-line
  return <>
    <List className="w12 __flex wrap hide show-sm">
      <Item className="w3 mt2 tc" x-for={navMenu in navMenus} key={navMenu.id}>
        <img className="circle" width={60} height={60} src={navMenu.avatar ?? IMAGE_PLACEHOLDER}/>
        <div className="mt1 f4">{navMenu.name}</div>
      </Item>
    </List>
  </>
}

// 动态列
const DynamicCol = ({ homeCol, docs, IS_MOBILE }) => {
  const { type, forum: { name, name_en, posts } , post, col_cnt: colCnt } = homeCol
  const colNames = matchPairs(type,
    ['docShow' , always({ colNameCn: '传承之路' , colNameEn: 'TEAM' })],
    ['docSche' , always({ colNameCn: '医生排班'  , colNameEn: 'SCHEDULE' })],
    [ANY       , always({ colNameCn: name       , colNameEn: name_en })],
  )
  const Col = matchPairs(homeCol,
    [{ type: 'docShow' }                              , always(<DocShow                {...{ docs, IS_MOBILE }}/>)],
    [{ type: 'docSche' }                              , always(<DocSche                {...{ docs }}/>)],
    [{ type: 'video' }                                , always(<VideoCol               {...{ posts, colCnt }}/>)],
    [{ type: 'album' }                                , always(<AlbumCol               {...{ posts, colCnt, IS_MOBILE }}/>)],
    [{ type: 'article', has_list: false, col_cnt: 1 } , always(<OneColArticleNoList    {...{ post }}/>)],
    [{ type: 'article', has_list: true , col_cnt: 1 } , always(<OneColArticleHasList   {...{ posts }}/>)],
    [{ type: 'article', has_list: false, col_cnt: 2 } , always(<TwoColArticleNoList    {...{ post }}/>)],
    [{ type: 'article', has_list: true , col_cnt: 2 } , always(<TwoColArticleHasList   {...{ post, posts }}/>)],
    [{ type: 'article', col_cnt: 3 }                  , always(<ThreeColArticleHasList {...{ post, posts }}/>)],
    [ANY                                              , always('')],
  )
  return <ColWrapper {...{ ...colNames, colCnt, IS_MOBILE }}>
    {Col}
  </ColWrapper>
}

// 动态行
const DynamicRows = ({ homeCols, docs, IS_MOBILE }) => {
  const pairedHomeCols = homeCols |> pairedByAttrSumEqualNum('col_cnt', 3)
  // console.log(pairedHomeCols)
  return <>
    {IS_MOBILE
      ? <Fragment x-for={(homeCol, index) in homeCols} key={index}>
        <DivideHorizen {...{ height: 20 }} />
        <DynamicCol {...{ homeCol, docs, IS_MOBILE }}/>
      </Fragment>
      : <RowWrapper x-for={(group, index) in pairedHomeCols} key={index}>
        <Fragment x-for={(homeCol, index) in group} key={index}>
          <DynamicCol {...{ homeCol, docs, IS_MOBILE }}/>
          {group.length > 1 && index < group.length - 1 && <DivideVertical />}
        </Fragment>
      </RowWrapper>
    }
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
function ColWrapper({ colNameCn, colNameEn, colCnt, IS_MOBILE, children }) {
  const width = IS_MOBILE ? '100%' : matchPairs(colCnt, [1, '33.33%'], [2, '66.66%'], [3, '100%'], [ANY, '100%'])
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
function OneColArticleNoList({ post }) {
  return <>
    <Article>
      <img width="100%" height={160} src={post.image || IMAGE_PLACEHOLDER}/>
      <div className="mt2 gray f4 t-justify indent">{post.title}</div>
    </Article>
  </>
}
function OneColArticleHasList({ posts }) {
  return <>
    <List>
      <Item className="w12 __flex j-between" x-for={(post, index) in posts}  key={index}>
        <div className="w12 lh2 __flex j-between">
          <Title className="gray f4">{post.title}</Title>
          <DateTime className="gray f4">{post.created_at |> formatDate} </DateTime>
        </div>
      </Item>
    </List>
  </>
}
function TwoColArticleNoList ({ post }) {
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
function TwoColArticleHasList ({ post: topPost, posts }) {
  return <section className="__flex">
    <Article className="flex1">
      <img width="100%" height={200} src={topPost.image || IMAGE_PLACEHOLDER}/>
      <div className="mt2 gray f4 t-justify indent">{topPost.title}</div>
    </Article>
    <DivideVertical/>
    <List className="flex1">
      <Item className="__flex j-between" x-for={(post, index) in tail(posts)}  key={index}>
        <Title className="gray f4">{post.title}</Title>
        <DateTime className="gray f4">{post.created_at |> formatDate} </DateTime>
      </Item>
    </List>
  </section>
}
function ThreeColArticleHasList ({ posts, post }) {
  return <>
    <section className="w12 __flex j-between">
      <img className="w5" height={300} src={post.image || IMAGE_PLACEHOLDER}/>
      <DivideVertical/>
      <section className="w7">
        <Title>{post.title}</Title>
        <Describe className="my2 gray f4 lh15 indent t-justify">{post.text}</Describe>
        <List>
          <Item className="w12 __flex j-between" x-for={(post, index) in tail(posts)}  key={index}>
            {/* <pre>{index}</pre> */}
            {/* <pre>{post.id}</pre> */}
            <div className="red mr2">new!</div>
            <div className="w12 __flex j-between">
              <Title className="gray f4">{post.title}</Title>
              <DateTime className="gray f4">{post.created_at |> formatDate}</DateTime>
            </div>
          </Item>
        </List>
      </section>
    </section>
  </>
}
function AlbumCol ({ posts, colCnt, IS_MOBILE }) {
  const _posts = take(colCnt*2, posts) // 按colCnt*2摘取条目
  return <>
    <List className="__flex j-between">
      <Fragment x-for={(post, index) in _posts}  key={index}>
        <Item className="flex1">
          <img width="100%" height={300} src={post.image || IMAGE_PLACEHOLDER}/>
        </Item>
        {_posts.length > 1 && index < _posts.length - 1 && <DivideVertical width={IS_MOBILE ? 10 : 30}/>}
      </Fragment>
    </List>
  </>
}
function VideoCol({ posts, colCnt }) {
  const _posts = take(colCnt, posts) // 按colCnt摘取条目
  return <>
    <List className="__flex j-between" >
      <Fragment x-for={(post, index) in _posts} key={index}>
        <Item className="flex1"> {/* 宽度均等 */}
          <video className="video"
            preload="auto"
            controls="controls"
            poster={IMAGE_PLACEHOLDER}
            src={post.video}/>
          <div className="f4">{post.title}</div>
        </Item>
        {_posts.length > 1 && index < _posts.length - 1 && <DivideVertical />}
      </Fragment>
    </List>
  </>
}
// 医生列表
function DocShow({ docs, IS_MOBILE }) {
  const _docs = take(IS_MOBILE ? 3 : 6, docs)
  return <>
    <section className="w12">
      {/* <ColWrapper {...colName} /> */}
      <List className="__flex j-between">
        <Fragment x-for={(doc, index) in _docs}  key={index}>
          <Item className="flex1 tc lh2">
            <img width="100%" height={IS_MOBILE ? 140 : 300} src={doc.imageUrl || IMAGE_PLACEHOLDER} />
            <div>{doc.name}</div>
            <div className="gray f4">{doc.title}</div>
          </Item>
          {/* <DivideVertical width={30} /> */}
          {index < _docs.length - 1 && <DivideVertical width={IS_MOBILE ? 10 : 30} />}
        </Fragment>
      </List>
    </section>
  </>
}
// 医生排班
function DocSche({ docs }) {
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
        <tr x-for={(doc, index) in docs} key={index}>
          <td className="dark">{doc.name}</td>
          <td>{doc.title}</td>
          <td>{doc.sche}</td>
        </tr>
      </tbody>
    </table>
  </>
}

// main
const Index = ({ hos, IS_MOBILE }) => {
  const { name: hosName, logo: hosLogo, qrcode, icp_num: icpNum, banners, announcement, navMenus, friendLinks, docs, homeCols } = hos
  return <>
    {/* 头部 */}
    <Header {...{ hosName, hosLogo, navMenus }} />
    {/* 大图 */}
    <ScrollSlide {...{ banners }} />
    {/* 主体 */}
    <MainContainer>
      {/*<pre>{announcement | inspect}</pre>*/}
      <HotNews {...{ announcement }}/>
      <DivideHorizen />
      <NavBtns {...{ navMenus }}/>
      <DivideHorizen />
      <DynamicRows {...{ homeCols, docs, IS_MOBILE }}/>
    </MainContainer>
    {/* 底部 */}
    <DivideHorizen />
    <Footer {...{ hosName, friendLinks, qrcode, icpNum }}/>
  </>
}

export default Index
