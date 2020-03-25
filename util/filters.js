// 柯里化函数结合管道符使用充当过滤器
import { PLACEHOLDER_IMAGE } from '@/constant'
import { truncate } from 'lodash'

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
