// 柯里化函数结合管道符使用充当过滤器
import { PLACEHOLDER_IMAGE } from '@/constant'

// 默认图像占位
export const imagePlaceholder = imageUrl => {
  return imageUrl || PLACEHOLDER_IMAGE
}
