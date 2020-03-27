import { store as createStore } from 'react-easy-state'
import sleep from 'await-sleep'

const globalStore = createStore({
  place: '定位中...',

  async getPlace() {
    await sleep(100)
    globalStore.place = 'hangzhou'
  },
})

export default globalStore
