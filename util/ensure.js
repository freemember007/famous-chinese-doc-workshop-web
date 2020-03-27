/**
 * 极简断言/验证库
 */

// 基本使用示例：
// ensure(req.query.hos_id, '医院ID不能为空')
// ensure(foo > bar, 'foo必须大于bar')
// ensure(foo.toString().match(/.../), 'foo格式不匹配')
// ensure(typeof foo === 'number', '函数bar的参数foo的类型必须为数字', 500) //服务端可传stateCode

function ensure(assertion, message) {
  if (!assertion) {
    (typeof window !== 'undefined') && alert(message)
    throw new Error(message)
  }
}

export default ensure
