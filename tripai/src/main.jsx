import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Idx from './create-trip/Idx'
import Header from './Custom/Header'
import { GoogleOAuthProvider } from '@react-oauth/google'
import View from './view-trip/[tripId]/View'
import Mytrip from './my-trips/Mytrip'


const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:"/trip",
    element:<Idx/>
  },
  {
    path:'/viewtrip/:tripId',
    element:<View/>
  },
  {
    path:'/my-trips',
    element:<Mytrip/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>

  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>  
    <Header/>
    <RouterProvider router={router}/>
  </GoogleOAuthProvider>    
  </StrictMode>,
)
