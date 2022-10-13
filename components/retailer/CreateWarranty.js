import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
const axios = require('axios');
import { useRouter } from 'next/router';
import warranty from '../../ethereum/warranty'
import web3 from '../../ethereum/web3';
import { Dimmer, Loader } from 'semantic-ui-react'

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

    setLoading({state: true, message: "Waiting for transaction to complete."});

    const accounts = await web3.eth.getAccounts();
    const mint = await warranty.methods.safeMint(state.accountAddress, metadataURI).send({
      from: accounts[0]
    })

    setLoading({state: true, message: "Processing"});

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
    
    setLoading({state: false});

  }


  const createWarranty = async (event) => {
    event.preventDefault();
    try {
      setLoading({state: true, message: "Processing"});

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
      setLoading({state: false});
      console.log(error.message);
    }
  }


  return (
    <div className="container">

      <Dimmer active={loading.state} inverted>
        <Loader>{loading.message}</Loader>
      </Dimmer>

      <Form onSubmit={createWarranty}>
        <Form.Field>
          <Form.Field>
            <label>Customer Account Address</label>
            <input type="text" name="accountAddress" value={state.accountAddress} onChange={onChange} required placeholder='Address' />
          </Form.Field>
          <Form.Field>
            <label>Model</label>
            <input type="text" name="model" value={state.model} onChange={onChange} required />
          </Form.Field>
          <Form.Field>
            <label>Serial Number</label>
            <input type="text" name="serialNumber" value={state.serialNumber} onChange={onChange} required />
          </Form.Field>
          <label>Purchased Date</label>
          <input type="date" name="purchasedDate" value={state.purchasedDate} disabled onChange={onChange} />
        </Form.Field>
        <Form.Field>
          <label>Expiry Date</label>
          <input type="date" name="expiryDate" value={state.expiryDate} onChange={onChange} />
        </Form.Field>

        <Button type='submit'>Create</Button>
      </Form>
      
    </div>
  )
}



