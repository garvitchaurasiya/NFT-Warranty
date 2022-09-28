import React, { useState, useEffect } from 'react'
import { Button, Form } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {

    const [state, setState] = useState(
        {
            accountAddress: "",
            accountType: "Consumer",
            password: ""
        }
    )
    let accounts = [""];
    useEffect(() => {

        const getAccountAddress = async () => {
            accounts = await web3.eth.getAccounts();
            setState({
                ...state, accountAddress: accounts[0]
            });
        }
        getAccountAddress();

    }, [])

    function onChange(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountAddress: state.accountAddress,
                password: state.password
            }),
        })

        const json = await response.json();
        if (json.success) {
            toast('🦊 Login successfull!', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error(json.error, {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }
    return (
        <div className="container">
            
            <ToastContainer />
            
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label htmlFor='accountAddress'>Account Address</label>
                    <input onChange={onChange} name="accountAddress" value={state.accountAddress} type="text" disabled />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input onChange={onChange} name="password" value={state.password} type="password" placeholder='Password' />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    )
}

export default Signup