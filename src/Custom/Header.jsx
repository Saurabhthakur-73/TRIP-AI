import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaGoogle } from "react-icons/fa";
import logo  from '../assets/coollogo_com-2563197.png'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function Header() {

  const user=JSON.parse(localStorage.getItem('user'));
  const [openDiglouge, setopenDiglouge] = useState(false);
  

  useEffect(()=>{
    console.log(user)
  },[])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserProfile(tokenResponse); // 👈 yaha call karo
    },
    onError: (error) => console.log(error)
  });

  const getUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((res) => {
      console.log("Google User Info:", res.data);
  
      // save to localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
  
      //  Close dialog
      setopenDiglouge(false);
      window.location.reload();
    }).catch((err) => {
      console.error("Error fetching user info:", err);
    });
  }
  
  return (
    <div className='p-4 shadow-sm flex justify-between items-center'>
      <img src={logo} alt="Logo" className="h-12 w-auto" />
      <div>
       {user?
        <div className='flex items-center gap-5'>

          <a href="/trip">
          <Button variant='outline' className='rounded-2xl text-black'>+ Create Trip</Button>
          </a>

          <a href="/my-trips">
          <Button variant='outline' className='rounded-2xl text-black'>My Trips</Button>
          </a>
          
          <Popover>
            <PopoverTrigger className='rounded-full px-1 py-1 bg-white' >
             <img src={user?.picture} alt='Acc' className='h-[40px] w-[40px] rounded-full'/>
            </PopoverTrigger>
            <PopoverContent>
            <a href="/" onClick={() => {
                  googleLogout();
                  localStorage.clear();
                }}>
                  <h2 className='cursor-pointer text-black'>Logout</h2>
                </a>
            </PopoverContent>
          </Popover>
        </div> : 
        <Button  onClick={()=>setopenDiglouge(true)}>Sign in</Button>
      } 
      </div>
      <Dialog open={openDiglouge} onOpenChange={setopenDiglouge} >
          <DialogContent>
            <DialogHeader>
                <DialogDescription>
                  <img src={logo} alt="logo" className='h-12 w-auto' />
                  <Button 
                  onClick={login}
                  className="w-full mt-5">
                  <FaGoogle/>   Sign in with google</Button>
                </DialogDescription>
            </DialogHeader>
          </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header
