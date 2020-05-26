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
    .retry(2, err => {
      if (err) {
        // i非出错时为null
        console.log('code', err.code)
        if (err.code.match(/^ECONN/)) {
          // 连接问题重试,如ECONNABORTED,ECONNREFUSED
          // if(err.errno == 'ETIMEDOUT'){ // 或限定在超时
          return true
        }
      }
    })
    .timeout({
      response: 60 * 1000 * 5, // Wait server to start sending
      deadline: 60 * 1000 * 5, // Wait file to finish loading
    })

  //--------------------------------------------------
  // onRequest
  //--------------------------------------------------
  request.on('request', (/*request*/) => {
    // console.log(request)
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
  // onError，包括连接错误和HTTP错误(!response.ok)
  //--------------------------------------------------
  request.on('error', (error) => {
    // console.log(keys(error), error)
    const response = error.response || {}
    const request = error.response?.request || {}
    const agentReqError = `
      ${error.status} ${error.toString()}
      【MSG】${response?.text}
      【REQ】${request.method?.toUpperCase()} ${decodeURIComponent(request.url)} ${request._formData}
    `
    IS_BROWSER ? alert(agentReqError) : console.log(agentReqError)

  })
})

module.exports = agent
