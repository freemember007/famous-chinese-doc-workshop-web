/*
 * Header
 */
import React from 'react'
// components
import { Article } from '@/components/tagName'
import ColumnHead from '@/components/ColumnHead'
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const OneColArticle = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    div.w4
      ColumnHead(...colName)
      Article
        img(width="100%", height=160, src=imageUrl || IMAGE_PLACEHOLDER)
        p.gray.f4.t-justify.indent
          | #{title}
  `
}

export default OneColArticle
