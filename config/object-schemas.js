/**
 * object schemas
 * 应用中需要特别指明的对象规格，主要是部分无法在其他地方定义规格的内嵌query对象，超到文档和验证的作用
 * 注：勿过度使用schema，如，rest请求的输入/输出body切勿声明，由数据库控制即可。
 */
import SimpleSchema from 'simpl-schema'

// baseQueryParams内嵌对象userInfo规格
export const userInfoSchema = new SimpleSchema({
  app_id       : {
    type     : SimpleSchema.Integer,
    min      : 100, // test
    required : true,
    label    : '基础query参数userInfo.app_id',
  },
  hos_id       : SimpleSchema.Integer,
  pat_id       : SimpleSchema.Integer,
  user_role    : {
    type          : String,
    allowedValues : ['pat', 'doc', 'dept', 'hos'],
  },
  pat          : Object,
  'pat.name'   : String,
  'pat.age'    : String,
  'pat.gender' : {
    type          : String,
    allowedValues : [ 'M', 'F', 'N']
  },
}, { requiredByDefault: false })
