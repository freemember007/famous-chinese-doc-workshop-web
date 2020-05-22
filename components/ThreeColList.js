/*
 * Header
 */
import React from 'react'
// components
import ColumnHead from '@/components/ColumnHead'
import DivideVertical from '@/components/DivideVertical'
import { Title, Describe, List, Item, DateTime } from '@/components/tagName'
new Date()
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const ThreeColList = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    ColumnHead(...colName, width=12)
      section.w12.__flex.j-between
        img.w5(height=300, src=imageUrl || IMAGE_PLACEHOLDER)
        DivideVertical
        section.w7
          Title 老年高血压中西医结合诊疗经验
          Describe.my2.gray.f4.lh15.indent.t-justify 关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
          List
            each post, index in [{}, {}, {}, {}]
              Item.w12.__flex.j-between
                div.red.mr2 new!
                div.w12.__flex.j-between
                  Title.gray.f4 关于举办2019年“中医护理技术在痛症中的应用学习班”的通知
                  DateTime.gray.f4 2020/05/03

  `
}

export default ThreeColList
