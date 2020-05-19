/*
 * Header
 */
import React from 'react'
// import { FullWidthContainer, MainContainer, List, Item } from '@/components/_tags'
// import Logo from 'svg-react-loader!../svgs/logo.svg'

const ColumnHead = ({ colNameCn, colNameEn }) => {
  return pug`
    div.mb4.pl4.bl.bw4.b-primary
      span #{colNameCn}
      span.mx1.gray /
      span.gray #{colNameEn}

  `
}

export default ColumnHead
