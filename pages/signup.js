import React, { useState, useEffect } from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Signup() {
    const router = useRouter();
    const [state, setState] = useState(
        {
            accountAddress: "",
            accountType: "Consumer",
            password: ""
        }
    )

    let accounts = [""];
    const getAccountAddress = async () => {
        accounts = await web3.eth.getAccounts();
        setState({
            ...state, accountAddress: accounts[0]
        });
    }

    useEffect(() => {
        getAccountAddress();
    }, [])

    function onChange(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (state.password.length < 3) {
            toast.warn("Password should be atleast of 3 characters!", {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (state.accountAddress === "") {
            toast.warn("Please login into metamask first or just referesh!", {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountAddress: state.accountAddress,
                accountType: state.accountType,
                password: state.password
            }),
        })

        const json = await response.json();
        if (json.success) {
            toast('🦊 Account has been created successfully!', {
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
        router.push("/login");
    }
    return (
        <div className="container">

            <ToastContainer />

            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <label htmlFor='accountAddress'>Account Address <Icon style={{"cursor":"pointer"}} onClick={getAccountAddress} name='refresh' /></label>

                    <input onChange={onChange} name="accountAddress" value={state.accountAddress} type="text" disabled />
                </Form.Field>
                <Form.Field>
                    <select name="accountType" value={state.accountType} onChange={onChange} >
                        <option>Consumer</option>
                        <option>Retailer</option>
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input onChange={onChange} name="password" value={state.password} type="password" placeholder='Password' />
                </Form.Field>
                <Form.Field>
                    <Link href="/login">
                        Already have an account?
                    </Link>
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    )
}

export default Signup