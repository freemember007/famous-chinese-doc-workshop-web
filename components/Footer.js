/*
 * Header
 */
import React from 'react'
import { FullWidthContainer, MainContainer } from '@/components/tagName'
import IMAGE_PLACEHOLDER from '@/config/constant'
const Footer = () => {
  return pug`
    FullWidthContainer.py6.w12.bg-dark.__flex.j-center
      MainContainer.w8.__flex.j-center
        section.t-center.f4.gray
          div
            span 网站链接：
            each num in [1,2,3,4,5,6]
              span.mr2 杭州市中医院科教科
          div.mt4.tc.__flex.j-center.a-center
            img(height=75, width=75, src=IMAGE_PLACEHOLDER)
            div.ml8.f4.gray.lh3
              div 杭州市中医院傅萍工作室 浙ICP备11042270号-3
              div 特扬网络 技术支持

  `
}

export default Footer
