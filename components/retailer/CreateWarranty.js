import React, { useState, useEffect } from 'react';
const axios = require('axios');
import { useRouter } from 'next/router';
import warranty from '../../ethereum/warranty'
import web3 from '../../ethereum/web3';
import Loader from '../Loader';

export default function CreateWarranty() {

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState({
    state: false,
    message: ""
  })
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


  let currentdate = new Date().toISOString().slice(0, 10);

  const [state, setState] = useState({
    purchasedDate: currentdate,
    expiryDate: currentdate,
    serialNumber: "",
    model: "",
    accountAddress: ""
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }


  const mintNFT = async (metadataURI) => {

    try {
      setLoading({ state: true, message: "Waiting for transaction..." });

      const accounts = await web3.eth.getAccounts();
      const mint = await warranty.methods.safeMint(state.accountAddress, metadataURI).send({
        from: accounts[0]
      })

      setLoading({ state: true, message: "Processing request..." });

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addwarranty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: mint.events.Transfer.returnValues.tokenId,
          accountAddress: state.accountAddress
        }),
      })
      const json = await response.json();
      console.log(json);

      setLoading({ state: false });
    } catch (error) {
      setLoading({ state: false });
      console.log(error.message);
    }



  }


  const createWarranty = async (event) => {
    event.preventDefault();
    try {
      setLoading({ state: true, message: "Processing" });

      var data = JSON.stringify({
        "pinataOptions": {
          "cidVersion": 1
        },
        "pinataMetadata": {
          "name": "testing",
          "keyvalues": {
            "customKey": "customValue",
            "customKey2": "customValue2"
          }
        },
        "pinataContent": {
          "model": state.model,
          "serialNumber": state.serialNumber,
          "purchasedDate": state.purchasedDate,
          "warrantyExpiryDate": state.expiryDate,
          "owner": state.accountAddress
        }
      });

      var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': '747fc320955426e6a8ba',
          'pinata_secret_api_key': 'dcf02bf0d42c39bd7664383d8aecf7f276a70bf614ca057019c732bedc07d021'
        },

        data: data
      };

      const res = await axios(config);

      const metadataURI = res.data.IpfsHash;
      // const metadataURI = 'bafkreieif3uo2h4uhjpkhs45fr2qcbukwbmwqxe4jzqj7s2qnwtudbbd64';
      mintNFT(metadataURI);

    } catch (error) {
      setLoading({ state: false });
      console.log(error.message);
    }
  }


  return (
    <div>
      {loading.state && <Loader message={loading.message} />}
      <form onSubmit={createWarranty} className="max-w-lg mx-auto p-8 rounded-xl mt-2" style={{ 'background-color': 'rgb(233 32 99 / 85%)' }}>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Customer Account Address</label>
          <input
            type="text"
            name="accountAddress"
            value={state.accountAddress}
            onChange={onChange}
            required
            placeholder="Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Model</label>
          <input
            type="text"
            name="model"
            value={state.model}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            value={state.serialNumber}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Purchased Date</label>
          <input
            type="date"
            name="purchasedDate"
            value={state.purchasedDate}
            disabled
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={state.expiryDate}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="">
          <button
            type="submit"
            className=" w-full px-4 py-2 font-bold text-white bg-black rounded hover:bg-indigo-500"
          >
            Create
          </button>
        </div>
      </form>

    </div>
  )
}



