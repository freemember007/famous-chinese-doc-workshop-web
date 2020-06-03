/*
 * Header
 */
import React from 'react'

const DivideHorizen = ({ height = 4 }) => {
  return <>
    <div style={{ width: '100%' }} className={'py' + height}>
    </div>
  </>
}

export default DivideHorizen
