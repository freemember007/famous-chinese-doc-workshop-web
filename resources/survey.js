import { Resource } from 'rest-hooks'

export default class SurveyResource extends Resource {
  id = undefined
  title = ''
  hos_id = null

  pk() {
    return this.id?.toString()
  }

  static urlRoot = 'https://api.diandianyy.com/common-biz/rest/'
}
