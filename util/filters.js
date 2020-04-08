// 柯里化函数结合管道符使用充当过滤器
import { PLACEHOLDER_IMAGE } from '@/constant'
import { truncate } from 'lodash'
import { isArray } from 'lodash/fp'
import { prepend, append } from 'rambdax'
import { ifElse, includes, without, concat, isEmpty, map, when, join, compose } from 'ramda'

// 默认图像占位
export const imagePlaceholder = imageUrl => {
  return imageUrl || PLACEHOLDER_IMAGE
}

// 自定义过滤器
// 文字缩略
export const omit = (charNum = 50) => {
  return input => truncate(input, { length: charNum, omission: '...'})
}

// 名字除第一字外以**显示
export const omitName = (name = '') => {
  return String(name).slice(0, 1) + '**'
}

// 计数为0不显示
export const omitCount = (count = 0) => {
  if(String(count) <= '0') return ''
  return '(' + String(count) + ')'
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

// 将对象中json数组值转为pg array string
export const transJsonArrayValueToPgArrayStr = (input = {}) => {
  return map(
    when(
      isArray,
      compose(prepend('{'), append('}'), join(','))
    )
  )(input)
}

// test
process?.argv[1]?.endsWith('filters.js')
 && console.log(transJsonArrayValueToPgArrayStr({a: [1, 'aa'], b: 1, c: 'str'}))
