import React, { useState } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
const axios = require('axios');
import Router from 'next/router';

export default function ProductDetails() {
  let currentdate = new Date().toISOString().slice(0, 10);

  const [state, setState] = useState({
    purchasedDate: currentdate,
    expiryDate: currentdate,
    serialNumber: "",
    modal: "",

  });

  const uploadMetadataOnChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
    console.log(state);
  }

  const uploadMetadata = async () => {


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
        }
      });
      console.log(data);

      // var config = {
      //   method: 'post',
      //   url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'pinata_api_key': '747fc320955426e6a8ba',
      //     'pinata_secret_api_key': 'dcf02bf0d42c39bd7664383d8aecf7f276a70bf614ca057019c732bedc07d021'
      //   },

      //   data: data
      // };

      // const res = await axios(config);
      // console.log(res.data);

      // Router.push(`/mintnft/${res.data.IpfsHash}`)
      Router.push(`/mintnft/res.data.bafkreieif3uo2h4uhjpkhs45fr2qcbukwbmwqxe4jzqj7s2qnwtudbbd64`)

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="container">


      <Form onSubmit={uploadMetadata}>
        <Form.Field>
          <Form.Field>
            <label>Modal</label>
            <input type="text" name="modal" value={state.modal} onChange={uploadMetadataOnChange} required />
          </Form.Field>
          <Form.Field>
            <label>Serial Number</label>
            <input type="text" name="serialNumber" value={state.serialNumber} onChange={uploadMetadataOnChange} required />
          </Form.Field>
          <label>Purchased Date</label>
          <input type="date" name="purchasedDate" value={state.purchasedDate} disabled onChange={uploadMetadataOnChange} />
        </Form.Field>
        <Form.Field>
          <label>Expiry Date</label>
          <input type="date" name="expiryDate" value={state.expiryDate} onChange={uploadMetadataOnChange} />
        </Form.Field>

        <Form.Field>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>


    </div>
  )
}



