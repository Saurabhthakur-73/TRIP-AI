import { db } from '@/Service/FirebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom'
import UserCard from './components/UserCard';

function Mytrip() {
  const navigation = useNavigation();
  const [userTrips, setuserTrips] = useState([])
    
const GetUserTiprs=async()=>{
    const user =JSON.parse(localStorage.getItem('user'))
    
    if (!user) {
        navigation('/')
        return ;
    }

    setuserTrips([]);
    const q = query(collection(db, 'AITRIPS'), where('userEmail','==',user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setuserTrips(prevVal=>[...prevVal, doc.data()])
    });
}

useEffect(()=>{
    GetUserTiprs();
},[])
  return (
    <div className='px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-2 mt-3 gap-4'>
        {userTrips.map((trip, index)=>(
          <UserCard trip={trip} />
        ))}
      </div>
    </div>
  )
}

export default Mytrip
