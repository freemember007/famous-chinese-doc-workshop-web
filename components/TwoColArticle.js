/*
 * Header
 */
import React from 'react'
// components
import { Article, Right, _title } from '@/components/_tags'
import ColumnHead from '@/components/ColumnHead'
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const TwoColArticle = ({ colNameCn, colNameEn, imageUrl, title, summary }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    div.w8.mr2
      ColumnHead(...colName)
      Article.__flex
        img(width=320, height=200, src=imageUrl || IMAGE_PLACEHOLDER)
        Right.ml2.flex1.__flex.column
          _title.tc #{title}
          p.gray.f4.t-justify.indent2
            | #{summary}
  `
}

export default TwoColArticle
