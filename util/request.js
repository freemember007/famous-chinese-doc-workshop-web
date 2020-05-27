/**
 * superagent封装
 */
import { CMS_REST_URL } from '@/config/constant'
import { matchPairs, ANY } from 'pampy'
import { startsWith } from 'ramda'
import { IS_BROWSER } from '@/config/constant'

const agent = require('superagent-use')(require('superagent'))

agent.use(request => {
  //--------------------------------------------------
  // request rewrite
  //--------------------------------------------------
  // console.log('request', request)
  // url处理
  request.url = matchPairs(request.url,
    [startsWith('http') , request.url],
    [ANY                , CMS_REST_URL + request.url],
  )

  // 超时及重试(注:重试仅处理连接问题，典型的有网络错误，超时错误等，其他错误无法在此捕捉)
  request
    .retry(3, (err) => {
      if ( err &&
        // 排除HTTP错误，仅连接错误重试, 包括ECONNABORTED,ECONNREFUSED,及超时(ETIMEDOUT)等
        ( err.code?.match(/^ECONN/) || err.errno === 'ETIMEDOUT' ) )
      {
        console.log('【superagent连接错误】', err.code || err.errno)
        return true
      }
      return false
    })
    .timeout({
      response: 60 * 1000 * 5, // Wait server to start sending
      deadline: 60 * 1000 * 5, // Wait file to finish loading
    })

  //--------------------------------------------------
  // onRequest
  //--------------------------------------------------
  request.on('request', (/*request*/) => {
    // console.log({ request })
  })

  //--------------------------------------------------
  // onResponse
  //--------------------------------------------------
  request.on('response', (response) => {
    if (response.ok) {
      // console.log({ response })
    } else {
      // 统一放在下面的on('error')处理
    }
  })

  //--------------------------------------------------
  // onError，包括连接错误和HTTP错误(即!response.ok，http状态码>=400)
  //--------------------------------------------------
  request.on('error', (error) => {
    // console.log(keys(error), error)
    const response = error.response || {}
    const request = error.response?.request || {}
    const agentReqError = `\n
      ${error.status} ${error.toString()}
      【MSG】${response?.text}
      【REQ】${request.method?.toUpperCase()} ${decodeURIComponent(request.url)} ${request._formData}
    \n`
    IS_BROWSER ? alert(agentReqError) : console.log(agentReqError)

  })
})

module.exports = agent
