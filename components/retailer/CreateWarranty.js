import React, { useState,useEffect } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
const axios = require('axios');
import {useRouter} from 'next/router';
import warranty from '../../ethereum/warranty'
import web3 from '../../ethereum/web3';

export default function CreateWarranty() {

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
  

  let currentdate = new Date().toISOString().slice(0, 10);

  const [state, setState] = useState({
    purchasedDate: currentdate,
    expiryDate: currentdate,
    serialNumber: "",
    modal: "",
    accountAddress: ""
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
    console.log(state);
  }


  const mintNFT = async (metadataURI) => {
    const accounts = await web3.eth.getAccounts();
    const mint = await warranty.methods.safeMint(state.accountAddress, metadataURI).send({
      from: accounts[0]
    })
    console.log("Success");
    console.log(mint.events.Transfer.returnValues.tokenId);

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

  }


  const createWarranty = async (event) => {
    event.preventDefault();
    try {
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
          "modal": state.modal,
          "serialNumber": state.serialNumber,
          "purchasedDate": state.purchasedDate,
          "warrantyExpiryDate": state.expiryDate,
          "owner": state.accountAddress
        }
      });
      console.log(data);

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
      console.log(res.data);

      const metadataURI = res.data.IpfsHash;
      // const metadataURI = 'bafkreieif3uo2h4uhjpkhs45fr2qcbukwbmwqxe4jzqj7s2qnwtudbbd64';
      mintNFT(metadataURI);
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className="container">
      <Form onSubmit={createWarranty}>
        <Form.Field>
          <Form.Field>
            <label>Customer Account Address</label>
            <input type="text" name="accountAddress" value={state.accountAddress} onChange={onChange} required placeholder='Address' />
          </Form.Field>
          <Form.Field>
            <label>Modal</label>
            <input type="text" name="modal" value={state.modal} onChange={onChange} required />
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

        <Form.Field>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>


    </div>
  )
}



