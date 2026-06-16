import React from 'react'
import mountains from '../Components/hello.jpg'
import { Button } from '@/components/ui/button'
import { IoIosShareAlt } from "react-icons/io";

function InfoSection({trip}) {
  return (
    <div>
      <img src={mountains} className='h-[300px] w-full object-cover rounded-xl' alt="pahad" />
        <div className='flex justify-between items-center'>
          
          <div className='my-5 flex flex-col gap-2'>
            <h2 className='mt-3 text-2xl font-bold '>{trip?.userselection?.Destination?.label}</h2>
              
              <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-slate-300 text-md mt-1 rounded-xl text-xs md:text-md'>Day : {trip?.userselection?.NumOfdays}</h2>
                <h2 className='p-1 px-3 bg-slate-300 text-md mt-1 rounded-xl text-xs md:text-md'>Budget : {trip?.userselection?.Budget}</h2>
                <h2 className='p-1 px-3 bg-slate-300 text-md mt-1 rounded-xl text-xs md:text-md'>Travel with : {trip?.userselection?.TravelWith}</h2>
              
              </div>
          </div>
        <Button>
            <IoIosShareAlt />
        </Button>
        </div> 
    </div>
  )
}

export default InfoSection

