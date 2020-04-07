import date from 'date.js'
import {
  format,
  parseISO,
  getYear    as _getYear,
  getMonth   as _getMonth,
  getDate    as _getDate,
  getWeek    as _getWeek,
  getDay     as _getDay,
  getHours   as _getHours,
  getMinutes as _getMinutes,
  getSeconds as _getSeconds,
} from 'date-fns/fp'
import { it, /*_*/ } from 'param.macro'
import { padEnd, /*replace*/ /* 忽略null/undefined, 比ramda更安全 */ } from 'lodash/fp'
import { compose, isNil, /*tap*/ } from 'ramda'
import { ifElse /* ramda的ifElse有bug，需两次调用，不知何故 */ } from 'rambdax'
// import { isBrowser } from '@/constant'

// shorthand... => null -> String
export const now       = () => format('y-MM-dd HH:mm:ss', date())
export const nowM      = () => format('y-MM-dd HH:mm:00', date())
export const nowH      = () => format('y-MM-dd HH:00:00', date())
export const today     = () => format('y-MM-dd', date())
export const yesterday = () => format('y-MM-dd', date('yesterday'))
export const tomorrow  = () => format('y-MM-dd', date('tomorrow'))

// parse辅助函数 @todo: 判断各种输入情况
// isBrowser && (window.date = parseISO) // just test, date函数在node与浏览器下处理结果不同
const parse = compose(
  // tap(console.log('解析后的日期为:', _)),
  ifElse(isNil, date, parseISO),
  // tap(console.log('日期str为:', _)),
  // date.js的在浏览器环境无法解析带T的日期，如：2020-03-23T12:51:43.976214
  // replace(/(\d)T(\d)/, '$1 $2'),
  // replace(/(\d{2}:\d{2}:\d{2})\.\d{4,6}/, '$1'),
)

// format... => Date | null -> String
export const formatDate       = it |> parse |> format('y-MM-dd')
export const formatTime       = it |> parse |> format('HH:mm:ss')
export const formatDateTime   = it |> parse |> format('y-MM-dd HH:mm:ss')
export const formatDateTimeM  = it |> parse |> format('y-MM-dd HH:mm')
export const formatDateTimeM2 = it |> parse |> format('y/MM/dd HH:mm')

// get... => parse | null -> Number
export const getYear    = it |> parse |> _getYear
export const getMonth   = it |> parse |> _getMonth
export const getDate    = it |> parse |> _getDate
export const getWeek    = it |> parse |> _getWeek
export const getDay     = it |> parse |> _getDay
export const getHours   = it |> parse |> _getHours
export const getMinutes = it |> parse |> _getMinutes
export const getSeconds = it |> parse |> _getSeconds

// test
process?.argv[1]?.endsWith('date.js')
  && !console.log('now'            |> padEnd(10), now())
  && !console.log('today'          |> padEnd(10), today())
  && !console.log('yesterday'      |> padEnd(10), yesterday())
  && !console.log('tomorrow'       |> padEnd(10), tomorrow())
  && !console.log('formatDateTime' |> padEnd(10), formatDateTime())
  && !console.log('formatDateTime' |> padEnd(10), formatDateTime('2020-03-23T12:51:43.976214'))
  && !console.log('getYear'        |> padEnd(10), getYear())
  && !console.log('getMonth'       |> padEnd(10), getMonth())
  && !console.log('getDate'        |> padEnd(10), getDate())
  && !console.log('getWeek'        |> padEnd(10), getWeek())
  && !console.log('getDay'         |> padEnd(10), getDay())
  && !console.log('getHours'       |> padEnd(10), getHours())
  && !console.log('getMinutes'     |> padEnd(10), getMinutes())
  && !console.log('getSeconds'     |> padEnd(10), getSeconds())
