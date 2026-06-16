import React, { act } from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'

function Visit({trip}) {
  return (
    
    <div>
      <h2 className='font-bold text-lg mt-8'>Places to Visit </h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
      {trip?.tripdata?.days?.map((item, index)=>(
        <div>
            <h2 className='font-medium mt-2'>Day {item.day} : {item.place}</h2>
            <Link to={'https://www.google.com/maps/search/?api=1&query='+item.activities} target='_blank'>
                <div className='list-disc list-inside text-sm mt-1'>
                    {item.activities?.map((act, idx)=>(
                       <div>
                        <Card place={act}/>
                       </div>
                    ))}
                </div>
             </Link>   
        </div>    
      ))}
      </div>
    </div>
  
  )
}

export default Visit
