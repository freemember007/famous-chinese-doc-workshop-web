/*
 * Header
 */
import React from 'react'

const MainContainer = ({ background = 'white', children }) => {
  return <>
    <section className={'w12 __flex j-center ' + 'bg-' + background}>
      <main className="w10 w11-xl w95-sm">
        {children}
      </main>
    </section>
  </>
}

export default MainContainer
