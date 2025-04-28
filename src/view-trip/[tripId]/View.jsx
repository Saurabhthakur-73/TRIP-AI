import { db } from '@/Service/FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../Components/InfoSection'
import Hotels from '../Components/Hotels'
import Visit from '../Components/Visit'
import Footer from '../Components/Footer'

function View() {

  const {tripId} = useParams()
  const [trip, setTrip] = useState([])

  useEffect(()=>{
    tripId&&GetTripData();
  },[tripId])

  const GetTripData=async()=>{
    const docref = doc(db, "AITRIPS", tripId)
    const docSnap = await getDoc(docref)

    if (docSnap.exists()) {
      console.log("avilable : ", docSnap.data())
      setTrip(docSnap.data());
    }else{
      console.log("not here")
      
    }

  }
  return (
    <div className='p-10 md:px-20  lg:px-44 xl:px-56'>
        {/*Informattion section*/}
          <InfoSection trip={trip}/>
        {/*recommended Hotels*/}
          <Hotels trip={trip}/>
        {/*itienary*/}
          <Visit trip={trip}/>
        {/*Footer*/}
          <Footer trip={trip}/>
    </div>
  )
}

export default View

