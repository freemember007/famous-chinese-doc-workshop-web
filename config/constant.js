/**
 * 全局常量/应用程序配置
 */
import { test } from 'ramda'
// import img from '@/svgs/one-pixel-gray-bg.svg'

// 环境定义
let FORCE_PROD
FORCE_PROD = true // 注释或反注释此行(供本地直连正式服测试)
export const IS_PROD = FORCE_PROD || !test(/(0|localhost|\d+\.*)/, location.host)

export const IS_BROWSER = typeof window !== 'undefined'

//--------------------------------------------------
// base url常量定义
//--------------------------------------------------
// 点点医院api url
export const DDYYAPI_BASE_URL = 'https://api.diandianyy.com/'

// 通用业务rest url(不建议使用)
export const COMMONBIZ_REST_URL = DDYYAPI_BASE_URL + 'common-biz/rest/'

// weixin base url
export const WX_URL = DDYYAPI_BASE_URL + 'util/weixin/app/'


//--------------------------------------------------
// 其他
//--------------------------------------------------
// 默认占位图 1*1px
// export const IMAGE_PLACEHOLDER = 'http://img.diandianys.com/Fh-6zclmUBp1TDOWTMXskCEeVJ4x'
// export const IMAGE_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUCB1jePbizX8ACSwDupmKZNwAAAAASUVORK5CYII='
export const IMAGE_PLACEHOLDER = './image-placeholder.svg'
