/**
 * superagent封装
 */
import { DDYYAPI_BASE_URL } from '@/constant'
import { matchPairs, ANY } from 'pampy'
import { startsWith } from 'ramda'

const agent = require('superagent-use')(require('superagent'))

agent.use(request => {
  //--------------------------------------------------
  // request rewrite
  //--------------------------------------------------
  console.log('request', request)
  // url处理
  request.url = matchPairs(request.url,
    [startsWith('http') , request.url],
    [ANY                , DDYYAPI_BASE_URL + request.url],
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
  request.on('request', request => {
    // console.log('request', request)
  })


  //--------------------------------------------------
  // onResponse
  //--------------------------------------------------
  request.on('response', response => {
    if (response.ok) {
      // console.log('status', response.status) // 打印请求日志
    } else {
      // http错误
      console.log('status', response.status) // 打印请求日志
      console.log('error', response.text) // 打印错误消息
    }
  })
  // error事件, 统一放在response事件处理
  request.on('error', error => {
    console.log('error', error) // error没有statusCode属性，response有，故统一用status比较安全
    // console.log('status', error.status) // error没有statusCode属性，response有，故统一用status比较安全
    // console.log('error', error.response.status) // 值同上
    // console.log('error', error.response.text)
  })
})

module.exports = agent
