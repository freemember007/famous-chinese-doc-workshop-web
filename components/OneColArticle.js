/*
 * Header
 */
import React from 'react'
// components
import { Article } from '@/components/_tags'
import ColumnHead from '@/components/ColumnHead'
// config
import { PLACEHOLDER_IMAGE } from '@/config/constant'

const OneColArticle = ({ colName, imageUrl, title }) => {
  return pug`
    div.w4.mr2
      ColumnHead(text=colName)
      Article
        img(width="100%", height=160, src=imageUrl || PLACEHOLDER_IMAGE)
        p.gray.f4.t-justify.indent2
          | #{title}
  `
}

export default OneColArticle
