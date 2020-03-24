import date from 'date.js'
import {
  format,
  getYear    as _getYear,
  getMonth   as _getMonth,
  getDate    as _getDate,
  getWeek    as _getWeek,
  getDay     as _getDay,
  getHours   as _getHours,
  getMinutes as _getMinutes,
  getSeconds as _getSeconds,
} from 'date-fns/fp'
import { it } from 'param.macro'
import { padEnd } from 'lodash/fp'

// shorthand... => null -> String
export const now       = () => format('y-MM-dd HH:mm:ss', date())
export const nowM      = () => format('y-MM-dd HH:mm:00', date())
export const nowH      = () => format('y-MM-dd HH:00:00', date())
export const today     = () => format('y-MM-dd', date())
export const yesterday = () => format('y-MM-dd', date('yesterday'))
export const tomorrow  = () => format('y-MM-dd', date('tomorrow'))


// format... => Date | null -> String
export const formatDate  = it |> date |> format('y-MM-dd')
export const formatTime  = it |> date |> format('HH:mm:ss')
export const formatDateTime    = it |> date |> format('y-MM-dd HH:mm:ss')
export const formatDateTimeM   = it |> date |> format('y-MM-dd HH:mm')
export const formatDateTimeM2  = it |> date |> format('y/MM/dd HH:mm')

// get... => Date | null -> Number
export const getYear    = it |> date |> _getYear
export const getMonth   = it |> date |> _getMonth
export const getDate    = it |> date |> _getDate
export const getWeek    = it |> date |> _getWeek
export const getDay     = it |> date |> _getDay
export const getHours   = it |> date |> _getHours
export const getMinutes = it |> date |> _getMinutes
export const getSeconds = it |> date |> _getSeconds

// test
process?.argv[1]?.endsWith('date.js')
  && console.log('now'        |> padEnd(10), now())
  && console.log('today'      |> padEnd(10), today())
  && console.log('yesterday'  |> padEnd(10), yesterday())
  && console.log('tomorrow'   |> padEnd(10), tomorrow())
  && console.log('getYear'    |> padEnd(10), getYear())
  && console.log('getMonth'   |> padEnd(10), getMonth())
  && console.log('getDate'    |> padEnd(10), getDate())
  && console.log('getWeek'    |> padEnd(10), getWeek())
  && console.log('getDay'     |> padEnd(10), getDay())
  && console.log('getHours'   |> padEnd(10), getHours())
  && console.log('getMinutes' |> padEnd(10), getMinutes())
  && console.log('getSeconds' |> padEnd(10), getSeconds())
