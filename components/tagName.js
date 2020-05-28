// 借助styled-components实现更语义化(semantic)的标签，无任何css
// 另styled-components在nextjs下不支持ssr，请勿使用任何样式
// ssr不生效，使用官方推荐的宏方式，也不行(但可避免开发阶段报服务端与客户端样式不一致警告)：
import styled from 'styled-components/macro'
// import styled from 'styled-components'

export const List               = styled.div``
export const Item               = styled.div``
export const Left               = styled.div``
export const Right              = styled.div``
export const DateTime           = styled.div``
export const Article            = styled.div``
export const Row                = styled.div``
export const Center             = styled.div``
export const SubTitle           = styled.div``
export const Sub                = styled.div``
export const Title              = styled.div``
export const Describe           = styled.div``
export const Text               = styled.div``
export const Container          = styled.div``
export const Flex               = styled.div``
export const Box                = styled.div``
export const Step               = styled.div``
export const ButtonGroup        = styled.div``
export const Wrapper            = styled.div``
export const FullWidthContainer = styled.div``
export const MainContainer      = styled.div``
export const Body               = styled.div``
export const Block              = styled.div``
export const Table              = styled.div``
