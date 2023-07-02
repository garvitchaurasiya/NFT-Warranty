import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import web3 from '../ethereum/web3';
import { FiRefreshCw } from 'react-icons/fi'
import Navbar from '../components/Navbar';

function Login() {
    const [state, setState] = useState({
        accountAddress: '',
        accountType: 'Consumer',
        password: '',
    });

    const router = useRouter();

    let accounts = [];

    const getAccountAddress = async () => {
        accounts = await web3.eth.getAccounts();
        setState({ ...state, accountAddress: accounts[0] });
    };

    useEffect(() => {
        getAccountAddress();
    }, []);

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
                password: state.password,
            }),
        });

        const json = await response.json();
        if (json.success) {
            toast('🦊 Login successful!', {
                position: 'top-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            router.push('/');
        } else {
            toast.error(json.error, {
                position: 'top-left',
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
        <>
            <Navbar/>
            <div className="mx-auto px-4 py-8">
                <ToastContainer />

                <form onSubmit={onSubmit} className="max-w-sm mx-auto p-12 rounded-xl" style={{ 'backgroundColor': 'rgb(233 32 99 / 85%)' }}>
                    <div className="mb-4">
                        <label htmlFor="accountAddress" className="block mb-1 font-semibold">
                            Account Address
                            <FiRefreshCw
                                onClick={getAccountAddress}
                                className="inline-block float-right cursor-pointer hover:text-blue-700"
                            />
                        </label>
                        <input
                            onChange={onChange}
                            name="accountAddress"
                            value={state.accountAddress}
                            type="text"
                            disabled
                            className="bg-white text-gray-400 cursor-not-allowed w-full px-4 py-2 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-semibold">
                            Password
                        </label>
                        <input
                            onChange={onChange}
                            name="password"
                            value={state.password}
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <Link href="/signup">
                            <a className="text-gray-800 hover:text-indigo-500">
                                Don&#39;t have an account?
                            </a>
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                    >
                        Login
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;
