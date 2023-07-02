import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import warranty from '../../ethereum/warranty';
import web3 from '../../ethereum/web3';
import Loader from '../Loader';

function AllWarranties() {
  const Router = useRouter();
  const [allTokenIds, setAllTokenIds] = useState([]);
  const [warrantyCards, setWarrantyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getMetadata(tokenId) {
    const accounts = await web3.eth.getAccounts();
    const uri = await warranty.methods.tokenURI(tokenId).call();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/getmetadata/${uri}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const json = await response.json();
    json['tokenId'] = tokenId;

    const today = new Date().toISOString().slice(0, 10);

    // logic to check whether warranty is expired or not?

    setWarrantyCards(current => [...current, json]);
  }

  const mapCards = (data) => {
    data.map((ele) => {
      getMetadata(ele);
    });
  };

  useEffect(() => {
    try {
      const myPromise = new Promise((resolve, reject) => {
        const getCards = async (accountAddress) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/getwarranties`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accountAddress: accountAddress,
              }),
            }
          );
          const json = await response.json();
          setAllTokenIds(json.warranties);
          resolve(json.warranties);
        };

        async function getUser() {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const json = await response.json();

          if (json.success) {
            getCards(json.user.accountAddress);
          } else {
            console.log('please login');
            Router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
          }
        }

        getUser();
      });

      myPromise.then((data) => {
        mapCards(data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
      console.log(loading, false)
    }

  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? <Loader /> : ""}
      <div id="cardsContainer">
        {
          warrantyCards.map((data, index) => {
            return (
              <div className='text-white rounded-lg shadow-lg p-4 mb-4' key={index} style={{ 'backgroundColor': 'rgb(0 0 0 / 90%)' }}>
                <div className='text-lg font-semibold mb-1'>{data.model}</div>
                <div className='text-gray-500 '>Warranty Unique ID: # {data.tokenId}</div>
                <div className='text-sm'>Product: {data.model}</div>
                <div className='text-sm'>Serial Number: {data.serialNumber}</div>
                <div className='text-sm'>Expiry Date: {data.warrantyExpiryDate}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default AllWarranties;
