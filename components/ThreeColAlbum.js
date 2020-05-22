/*
 * Header
 */
import React from 'react'
// components
import ColumnHead from '@/components/ColumnHead'
import DivideVertical from '@/components/DivideVertical'
import { List, Item } from '@/components/tagName'
new Date()
// config
import { IMAGE_PLACEHOLDER } from '@/config/constant'

const ThreeColList = ({ colNameCn, colNameEn, imageUrl, title }) => {
  const colName = { colNameCn, colNameEn }
  return pug`
    ColumnHead(...colName, width=12)
      List.w12.__flex.j-between
        each index in [1,2,3,4]
          Item.w3(key=index)
            img.w12(height=300, src=imageUrl || IMAGE_PLACEHOLDER)
          if index < 4
            DivideVertical
  `
}

export default ThreeColList
