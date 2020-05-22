/*
 * Header
 */
import React from 'react'
// components
import { Article, Right, Title } from '@/components/tagName'
import ColumnHead from '@/components/ColumnHead'
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const TwoColArticle = ({ colNameCn, colNameEn, imageUrl, title, summary }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    div.w8
      ColumnHead(...colName)
      Article.__flex
        img(width=320, height=200, src=imageUrl || IMAGE_PLACEHOLDER)
        Right.ml2.flex1.__flex.column
          Title.tc #{title}
          div.mt2.gray.f4.t-justify.indent2
            | #{summary}
  `
}

export default TwoColArticle
