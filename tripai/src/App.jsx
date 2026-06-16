import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import Home from './Custom/Home'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Home/>
    </>
  )
}

export default App
