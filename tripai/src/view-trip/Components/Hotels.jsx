import React from 'react'
import pool from '../Components/pool.jpg'
import { Link } from 'react-router-dom'

function Hotels({trip}) {
  console.log(trip)
  return (
    <div>  
      <h2 className='font-bold text-xl mt-5 mb-4'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {trip?.tripdata?.days?.map((hotel, index)=>(
            <Link className='text-black' to={'https://www.google.com/maps/search/?api=1&query='+hotel.hotel+","+hotel.hotelAddress}  target='_blank'>
            <div className='hover:scale-110 transition-all'>
              <img src={ pool} alt={hotel.hotel || "Hotel Image"} className='rounded-xl w-full h-50 object-cover' />
              <div className='my-1'>
                <h2 className='font-medium'>{hotel.hotel}</h2>
                <p className='text-sm'>📍{hotel.hotelAddress}</p>
                <h2 className='font-mono'>💸{hotel.estimatedCost}</h2>
              </div>
            </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Hotels