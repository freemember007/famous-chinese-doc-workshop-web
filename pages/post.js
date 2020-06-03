//// post 文章
// framework
import React, { Fragment }             from 'react' // eslint-disable-line
// components
import { List, Item, Title, Article, Content, Right, Describe, DateTime, Row, Col } from '@/components/tagName' // eslint-disable-line
import MainContainer                   from '@/components/MainContainer'
import Header                          from '@/components/Header'
import Footer                          from '@/components/footer'
import DivideVertical                  from '@/components/DivideVertical'
import DivideHorizen                   from '@/components/DivideHorizen'
import LineHorizen                     from '@/components/LineHorizen'
// fp
import { tail, test, map, omit, always, pick, tap, keys, evolve, head, assoc, defaultTo, take, ifElse, identity } from 'ramda' // eslint-disable-line
import { it, _ }                       from 'param.macro' // eslint-disable-line
import { matchPairs, ANY }             from 'pampy' // eslint-disable-line
// util
import { IMAGE_PLACEHOLDER }           from '@/config/constant'
import agent                           from '@/util/request'
import { inspect, pairedByAttrSumEqualNum } from '@/util/filters' // eslint-disable-line
import { formatDate }                  from '@/util/date'
import ensure                          from '@/util/ensure'

// props
export const getServerSideProps = async ({ req, res, query }) => { // eslint-disable-line
  // query params
  const {
    /* eslint-disable */
    id,           // post id
  } = query

  // ensure
  ensure(id, '版块ID不能为空')

  const post = await agent
    .get('post')
    .set({ Accept: 'application/vnd.pgrst.object+json' })
    .query({
      id            : 'eq.' + 1,
      select        : '*, forum(*, subForums:sub_forum(*)), hos(*, navMenus:nav_menu(*), friendLinks:link(*))',
      'posts.order' : 'created_at.desc',
    })
    .then(it.body)
    // .then(res.end(_ |> inspect), res.end(_ |> inspect))
  return { props: { post } }
}

// 大图
const ScrollSlide = ({ image }) => {
  return <>
    <img className="fit" width="100%" height="300" src={image ?? IMAGE_PLACEHOLDER} />
  </>
}

// 面包屑
const Breadcrumb = () => {
  const breadcrumbs = ['首页', '医疗服务', '预约挂号']
  const rightArrow = <span className="mx2 gray">›</span>
  return <>
    <section className="mt4 f4 dark __flex">
      <div>您的位置：</div>
      <List className="__flex">
        <Item x-for={(breadcrumb, index) in breadcrumbs} key={index}>
          <span>{breadcrumb}</span>
          {breadcrumbs.length > 1 && index < breadcrumbs.length - 1 && rightArrow }
        </Item>
      </List>
    </section>
  </>
}

// 子栏目导航
const SubForumNav = () => {
  const subForums = ['子栏目一', '子栏目三', '子栏目三']
  return <>
    <section className="w3 hide-sm">
      <div className="f2 bold mb4">医疗服务</div>
      <List className="">
        <Item x-for={(subForum, index) in subForums} key={index}>
          {subForum}
          {subForums.length > 1 && index < subForums.length - 1 && <LineHorizen margin={2}/> }
        </Item>
      </List>
    </section>
    <div className="hide-sm"> <DivideVertical width={4}/> </div>
  </>
}

// 文章列表
const PostDetail = ({ post }) => {
  return <>
    <section className="w8 flex1 __flex">
      <Article className="w12 gray">
        <Title className="mb4 f2 tc bold dark">{post.title}</Title>
        <DateTime className="mb8 tc gray f4">{post.created_at |> formatDate}</DateTime>
        <Content>{post.text}</Content>
      </Article>
    </section>
  </>
}

// main
const Post = ({ post }) => {
  const { forum, hos } = post
  const { name: hosName, logo: hosLogo, navMenus, qrcode, icp_num: icpNum, friendLinks } = hos
  const { subForums } = forum
  return <>
    {/* 头部 */}
    <Header {...{ hosName, hosLogo, navMenus }} />
    {/* 大图 */}
    <ScrollSlide {...{ image: forum.image }} />
    {/* 主体 */}
    <MainContainer>
      <Breadcrumb {...{ }}/>
      <LineHorizen height={2}/>
      <section className="mt8 __flex">
        <SubForumNav {...{ subForums }}/>
        <PostDetail {...{ post }}/>
      </section>
    </MainContainer>
    {/* 底部 */}
    <DivideHorizen />
    <Footer {...{ hosName, friendLinks, qrcode, icpNum }}/>
  </>
}

export default Post
