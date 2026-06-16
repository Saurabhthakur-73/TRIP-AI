import React from 'react'
import hello from '../Components/hello.jpg'


function Card({place}) {
  return (  
    <div className='mt-5 shadow-xl rounded-xl p-1 hover:scale-105 transition-all hover:shadow-xl'>
      <img className='rounded-xl w-full h-50 object-cover ' src={hello} alt={place} />
      <p className='mt-2 mb-2 text-center text-sm font-medium'>{place}</p>
    </div>
  )
}

export default Card
