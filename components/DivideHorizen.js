/*
 * Header
 */
import React from 'react'

const DivideHorizen = ({ height = 30 }) => {
  return pug`
    div(style={ width: '100%', height: Number(height)}, className="")
  `
}

export default DivideHorizen
