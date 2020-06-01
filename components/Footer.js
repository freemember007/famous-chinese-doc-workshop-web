/*
 * Header
 */
import React             from 'react'
import MainContainer     from '@/components/MainContainer'
import IMAGE_PLACEHOLDER from '@/config/constant'

const Footer = ({ hosName, friendLinks, qrcode, icpNum }) => {
  return <>
    <MainContainer background="dark">
      <section className="py6 tc f4 gray">
        <div>
          <span>网站链接：</span>
          <span className="mr2" x-for={link in friendLinks} key={link.id}>{link.name}</span>
        </div>
        <div className="mt4 __flex j-center a-center">
          <img height={75} width={75} src={qrcode ?? IMAGE_PLACEHOLDER}/>
          <div className="ml8 f4 gray lh3">
            <div>{[hosName, icpNum].join(' ')}</div>
            <div>特扬网络 技术支持</div>
          </div>
        </div>
      </section>
    </MainContainer>
  </>
}

export default Footer
