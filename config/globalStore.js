// globalStore 全局状态
import { createGlobalState } from 'react-hooks-global-state'

// useGlobal`Store`
export const { useGlobalState: useGlobalStore } = createGlobalState({
  // isSessionSaved    : false,        // _app.js session是否已经保存
})
