/*
 * LineVertical 垂直线
 */
import React from 'react'
import { matchPairs, ANY } from 'pampy'

const LineVertical = ({ height = 'auto', width = 1, color, margin=4}) => {
  const backgroundClassName = matchPairs(color,
    ['primary', 'bg'], ['gray', 'bg-gray'], [ANY, 'bg-dark']
  )
  const marginClassName = 'mx' + margin

  return <>
    <div style={{ width: width + 'px', height }} className={[marginClassName, backgroundClassName].join(' ')}>

    </div>
  </>
}

export default LineVertical
