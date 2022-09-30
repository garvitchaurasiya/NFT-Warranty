import React, { useEffect } from 'react'
import Retailer from '../components/retailer/Home';
import Consumer from '../components/consumer/Home';

function Home() {

  useEffect(() => {
    
    async function getUser() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await response.json();
      console.log(json);

    }

    getUser();

  }, [])


  return (
    <div>
      This is home
    </div>
  )
}

export default Home