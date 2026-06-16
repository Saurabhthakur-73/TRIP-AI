import { Button } from '@/components/ui/button'
import React from 'react'
import {Link } from 'react-router-dom'
import exp from './exp.jpg'

function Home() {
  return (
    <div lassName='flex flex-col items-center mx-56 gap-9'>
      <h1 className='font-semibold text-[50px] text-center mt-9'>
      <span className='text-orange-600'>Discover Your Next Adventure with AI</span> Personlized Itineraries at Your Fingertips
      </h1> 
      <p className='text-2xl text-gray-800 text-center mt-5 mb-8 ' >Your Personal trip planner and travel organizer, creating custom itineraries tailored to your interests and budget.</p>
      
      <div className="flex items-center justify-center">
        <Link to={'/trip'}>
        <Button>Click here</Button>
        </Link>
      </div>
      
      <div className=' p-20 '>
        <img src={exp} alt="" className=' rounded-2xl' />
      </div>
      

    
    </div>
  )
}

export default Home
