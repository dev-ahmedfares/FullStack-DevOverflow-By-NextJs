import LeftSidebar from '@/components/shared/LeftSidebar'
import Navbar from '@/components/shared/Navbar/Navbar'
import RightSidebar from '@/components/shared/RightSidebar'
import React from 'react'

export default function layout() {
  return (
    <main className='background-light850_dark100 relative'>
        <Navbar/> 
        <div className='flex'>
            <LeftSidebar/>
            <section className='min-h-screen flex-1'>

            </section>
            <RightSidebar/>
        </div>
    </main>
  )
}
