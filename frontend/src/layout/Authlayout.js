import React from 'react'

const Authlayout = ({children}) => {
  return (
    <>
    <header className='flex justify-center py-3 h-20 shadow-md bg-white'>
     <h1 className='text-4xl'>Chat-app</h1> 
    </header>
    {children}
    </>
  )
}

export default Authlayout
