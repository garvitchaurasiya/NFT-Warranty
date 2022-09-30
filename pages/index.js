import React, { useState, useEffect } from 'react'
import Retailer from '../components/retailer/Home';
import Consumer from '../components/consumer/Home';
import { useRouter } from 'next/router';

function Home(props) {

  const [user, setUser] = useState({});

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await response.json();

      if (json.success) {
        setUser(json.user);
      }
      else {
        router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
      }

      console.log("in _app.js")

    }

    getUser();
  }, [])

  return (
    <div>
      
      { user.accountType==='Retailer' ? <Retailer/> : <Consumer/>}

    </div>
  )
}

export default Home