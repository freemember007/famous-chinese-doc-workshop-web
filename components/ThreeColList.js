/*
 * Header
 */
import React, { Fragment } from 'react' // eslint-disable-line
// components
import ColumnHead from '@/components/ColumnHead'
import DivideVertical from '@/components/DivideVertical'
import { Title, Describe, List, Item, DateTime } from '@/components/tagName'
new Date()
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const ThreeColList = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }

  return <>
    <ColumnHead {...colName} width={12}>
      <section className="w12 __flex j-between">
        <img className="w5" height={300} src={imageUrl || IMAGE_PLACEHOLDER}/>
        <DivideVertical/>
        <section className="w7">
          <Title>老年高血压中西医结合诊疗经验</Title>
          <Describe className="my2 gray f4 lh15 indent t-justify">
            关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
          </Describe>
          <List>
            <Item className="w12 __flex j-between" x-for={(post, index) in [{id:1}, {id:2}, {id:3}, {id:4}]}  key={post.id}>
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
    </ColumnHead>
  </>
}

export default ThreeColList
