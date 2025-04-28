import React from 'react'
import hello from '../../view-trip/Components/hello.jpg'
import { Link } from 'react-router-dom'

function UserCard({trip}) {
  return (
    <Link to={'/viewtrip/'+trip?.id}>
    <div className=' border-black p-5 shadow-xl rounded-xl hover:scale-105 transition-all'>
      <img src={hello} alt="" className='object-cover rounded-xl h-[200px] w-[400px] mb-4'/>
      <div>
        <h2 className='font-bold'>{trip?.userselection?.Destination?.label}</h2>
        <h2 className='text-sm text-gray-400'>{trip?.userselection?.NumOfdays} Days Trip in {trip?.userselection?.Budget} Budget</h2>
      </div>
    </div>
    </Link>
  )
}

export default UserCard
