/*
 * Header
 */
import React from 'react'
// components
import { Article } from '@/components/_tags'
import ColumnHead from '@/components/ColumnHead'
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const OneColList = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    ColumnHead(...colName, width=4)
      Article
        img(width="100%", height=160, src=imageUrl || IMAGE_PLACEHOLDER)
        p.gray.f4.t-justify.indent2
          | #{title}
  `
}

export default OneColList
