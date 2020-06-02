//// post 文章
// framework
import React, { Fragment }             from 'react' // eslint-disable-line
// components
import { List, Item, Title, Article, Right, Describe, DateTime, Row, Col } from '@/components/tagName' // eslint-disable-line
import MainContainer                   from '@/components/MainContainer'
import Header                          from '@/components/Header'
import Footer                          from '@/components/footer'
import DivideVertical                  from '@/components/DivideVertical'
import DivideHorizen                   from '@/components/DivideHorizen'
// fp
import { tail, test, map, omit, always, pick, tap, keys, evolve, head, assoc, defaultTo, take, ifElse, identity } from 'ramda' // eslint-disable-line
import { dissocDotPath, defaultToEmptyArray, defaultToEmptyObject } from 'ramda-extension'
import { it, _ }                       from 'param.macro' // eslint-disable-line
import { matchPairs, ANY }             from 'pampy' // eslint-disable-line
// util
import { IMAGE_PLACEHOLDER }           from '@/config/constant'
import agent                           from '@/util/request'
import { inspect, pairedByAttrSumEqualNum } from '@/util/filters' // eslint-disable-line
import { formatDate }                  from '@/util/date'

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
    .then(evolve({ homeCols: map(dissocDotPath('forum.topPost')) }))
    .then(evolve({ homeCols: map(evolve({ col_cnt: ifElse(always(IS_MOBILE), always(1), identity) })) }))
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
    <section className="w12 mt2 p3 b __flex a-center">
      <div className="mr4 hide-sm"> 最新动态 </div>
      <List className="flex1 f4 gray">
        <Item x-for={post in announcement.posts} className="w12 __flex j-between" key={post.id}>
          <div className="mr2 red hide-sm"> new! </div>
          <div className="mr2 red show-sm"> • </div>
          <div className="w12 __flex j-between">
            <Title className="gray f4">{post.title}</Title>
            <DateTime className="gray f4 hide-sm">{post.created_at |> formatDate}</DateTime>
          </div>
        </Item>
      </List>
    </section>
  </>
}

// main
const Post = ({ hos, IS_MOBILE }) => {
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
    </MainContainer>
    {/* 底部 */}
    <DivideHorizen />
    <Footer {...{ hosName, friendLinks, qrcode, icpNum }}/>
  </>
}

export default Post
