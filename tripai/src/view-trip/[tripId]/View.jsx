import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../Components/InfoSection'
import Hotels from '../Components/Hotels'
import Visit from '../Components/Visit'
import Footer from '../Components/Footer'
import API_BASE, { authHeader } from '@/Service/api'

function View() {

  const { tripId } = useParams()
  const [trip, setTrip] = useState([])

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId])

  const GetTripData = async () => {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}`, {
        headers: authHeader(),
      });
      const data = await res.json();

      if (data.success) {
        console.log("available: ", data.trip);
        // userSelection aur tripData ko combine karke purane Firebase format jaisa banao
        setTrip({
          userselection: data.trip.userSelection,
          tripdata: data.trip.tripData,
          id: data.trip._id,
        });
      } else {
        console.log("not here");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  }

  return (
    <div className='p-10 md:px-20  lg:px-44 xl:px-56'>
      {/*Informattion section*/}
      <InfoSection trip={trip} />
      {/*recommended Hotels*/}
      <Hotels trip={trip} />
      {/*itienary*/}
      <Visit trip={trip} />
      {/*Footer*/}
      <Footer trip={trip} />
    </div>
  )
}

export default View