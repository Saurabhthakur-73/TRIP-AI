import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserCard from './components/UserCard';
import API_BASE, { authHeader } from '@/Service/api'

function Mytrip() {
  const navigate = useNavigate();
  const [userTrips, setuserTrips] = useState([])

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
      navigate('/')
      return;
    }

    setuserTrips([]);

    try {
      const res = await fetch(`${API_BASE}/trips/my-trips`, {
        headers: authHeader(),
      });
      const data = await res.json();

      if (data.success) {
        // Purane Firebase format jaisa banao (UserCard compatibility ke liye)
        const formattedTrips = data.trips.map(trip => ({
          userselection: trip.userSelection,
          tripdata: trip.tripData,
          id: trip._id,
        }));
        setuserTrips(formattedTrips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }

  useEffect(() => {
    GetUserTrips();
  }, [])

  return (
    <div className='px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-2 mt-3 gap-4'>
        {userTrips.map((trip, index) => (
          <UserCard trip={trip} key={index} />
        ))}
      </div>
    </div>
  )
}

export default Mytrip