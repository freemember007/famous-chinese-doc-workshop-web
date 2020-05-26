/*
 * Header
 */
import React from 'react'

const DivideVertical = ({ width = 30 }) => {
  return pug`
    div(style={ width: width, height: 'auto'})
  `
}

export default DivideVertical
