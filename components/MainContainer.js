/*
 * Header
 */
import React from 'react'

const MainContainer = ({ background = 'white', children }) => {
  return pug`
    div.w12.__flex.j-center(className="bg-" + background)
      main.w10.w11-xl #{children}
  `
}

export default MainContainer
