/*
 * Header
 */
import React from 'react'

const DivideVertical = ({ width }) => {
  return pug`
    div(style={ width: width, height: 'auto'})
  `
}

export default DivideVertical
