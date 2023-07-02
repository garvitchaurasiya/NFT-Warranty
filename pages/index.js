import React, { useState, useEffect } from 'react'
import Retailer from '../components/retailer/RetailerNavbar';
import Consumer from '../components/consumer/ConsumerNavbar';
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

    }

    getUser();
  }, [])

  return (
    <div>
      {/* { user.accountType==='Retailer' ? <Retailer/> : <Consumer/>} */}
      {/* <img src={'https://api.time.com/wp-content/uploads/2021/03/nft-art-1.jpg'}/> */}
      {user.accountType==='Retailer' && <Retailer/>}
      {user.accountType==='Consumer' && <Consumer/>}

    </div>
  )
}

export default Home