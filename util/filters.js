// 柯里化函数结合管道符使用充当过滤器
import { truncate } from 'lodash'
import { isArray } from 'lodash/fp'
import { tryCatch, prepend, append } from 'rambdax'
import { isNotPlainObj } from 'ramda-adjunct'
import { alwaysEmptyObject } from 'ramda-extension'
import { ifElse, identity, includes, without, concat, isEmpty, map, when, join, compose } from 'ramda'

// 自定义过滤器
// 文字缩略
export const omit = (charNum = 50) => {
  return input => truncate(input, { length: charNum, omission: '...'})
}

// 名字除第一字外以**显示
export const omitName = (name = '') => {
  return String(name).slice(0, 1) + '**'
}

export const showJson = (obj = {}) => {
  return JSON.stringify(obj, null, 4)
}

// 计数为0不显示
export const omitCount = (count = 0) => {
  if(String(count) <= '0') return ''
  return '(' + String(count) + ')'
}

// 如果不为空添加后缀，比如，[xxx的]xxx，中间加'的'的情况
export const ifNotNilAppend = appendStr => (input = '') => {
  return input ? input + appendStr : ''
}

// 分数格式化为百分比
export const percent = (input = 0) => {
  return String(Number(input)*100) + '%'
}

// 数组添加或移除元素（典型场景：多选model）
export const concatOrWithout = item => list => {
  const _list = list || []
  const _list2 = ifElse(includes(item), without([item]), concat([item]))(_list)
  return isEmpty(_list2) ? undefined : _list2
}

// ParseJSONObject，如非对象或出错，返回空对象
export const mayBeParseJSONObjectOrEmptyObject = any => {
  return any
    |> tryCatch(JSON.parse, identity)
    |> when(isNotPlainObj, alwaysEmptyObject)
}

// 将对象中json数组值转为pg array string
export const transJsonArrayValueToPgArrayStr = (input = {}) => {
  return map(
    when(
      isArray,
      compose(prepend('{'), append('}'), join(','))
    )
  )(input)
}

// groupBySomeAttrSumEqualToNum group对象数组by某属性sum等于某num
// 如: [{ cnt: 1}, { cnt: 2 }, {cnt: 3}] => [[{ cnt: 1}, { cnt: 2 }], [{cnt: 3}]]
export const groupObjectArrayByAttrSumEqual = (attr, num) => arr => {
  let startIdx = 0
  let sum = 0
  let newArr = []
  arr.forEach((obj, idx) => {
    sum += obj[attr]
    if(sum === num) {
      newArr.push(arr.slice(startIdx, idx + 1))
      sum = 0
      startIdx = idx + 1
    }
  })
  return newArr
}

// test
process?.argv[1]?.endsWith('filters.js')
 && console.log(transJsonArrayValueToPgArrayStr({a: [1, 'aa'], b: 1, c: 'str'}))
