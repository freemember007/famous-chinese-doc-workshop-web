/*
 * DivideVertical 垂直间隔
 */
import React from 'react'

const DivideVertical = ({ width = 2 }) => {
  return <>
    <div style={{ height: 'auto' }} className={'px' + width}>
    </div>
  </>
}

export default DivideVertical
