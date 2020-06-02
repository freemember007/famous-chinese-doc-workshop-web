/*
 * LineHorizen 水平线
 */
import React from 'react'
// import { matchPairs, ANY } from 'pampy'

const LineHorizen = ({ height = 1, width = 12, background = '#ddd', margin=4}) => {
  // const backgroundClassName = matchPairs(background,
  //   ['primary', 'bg'], ['gray', 'bg-gray'], [ANY, 'bg-gray']
  // )
  const widthClassName = 'w' + width
  const marginClassName = 'my' + margin
  return <>
    <div style={{ height, background }} className={[marginClassName, widthClassName].join(' ')}>
    </div>
  </>
}

export default LineHorizen
