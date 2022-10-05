import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
const axios = require('axios');
import { useRouter } from 'next/router';
import warranty from '../../ethereum/warranty'
import web3 from '../../ethereum/web3';
import { stringifyQuery } from 'next/dist/server/server-route-utils';

function TransferOwnership() {

    const [user, setUser] = useState({});

    const router = useRouter();

    let currentdate = new Date().toISOString().slice(0, 10);

    const [state, setState] = useState({
        accountAddress: "",
        sendTo: "",
        id: ""
    });

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

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
                setState({...state, accountAddress: json.user.accountAddress});
            }
            else {
                router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
            }

        }

        getUser();
    }, [])

    const transfer = async()=>{
        try {
            console.log('inside');
            const accounts = await web3.eth.getAccounts();
            await warranty.methods.safeTransferFrom(state.accountAddress, state.sendTo, state.id).send({from: accounts[0]});
            // console.log('2');
            // // Remove from previous owner

            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatewarranties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountAddress: state.accountAddress,
                    sendTo: state.sendTo,
                    tokenId: state.id
                })
            })
            const json = await response.json();
            console.log('3');

            console.log(json);

        } catch (error) {
            console.log("Some error occured", error.message);
        }

    }


    return (
        <div className="container">
            <Form onSubmit={transfer}>
                <Form.Field>
                    <Form.Field>
                        <label htmlFor='accountAddress'>Account Address</label>
                        <input onChange={onChange} name="accountAddress" value={state.accountAddress} type="text" disabled />
                    </Form.Field>
                    <Form.Field>
                        <label>Tranfer Ownership To</label>
                        <input type="text" name="sendTo" value={state.sendTo} onChange={onChange} required placeholder='Address' />
                    </Form.Field>
                    <Form.Field>
                        <label>ID</label>
                        <input type="number" name="id" value={state.id} onChange={onChange} required placeholder='#id'/>
                    </Form.Field>
                </Form.Field>

                <Button type='submit'>Transfer</Button>
            </Form>


        </div>
    )
}

export default TransferOwnership