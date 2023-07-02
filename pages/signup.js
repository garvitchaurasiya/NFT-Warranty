import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import web3 from '../ethereum/web3';
import { FiRefreshCw } from 'react-icons/fi'
import Navbar from '../components/Navbar';

function Signup() {
  const router = useRouter();
  const [state, setState] = useState({
    accountAddress: '',
    accountType: 'Consumer',
    password: '',
  });

  let accounts = [''];
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
    if (state.password.length < 3) {
      toast.warn('Password should be at least 3 characters!', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (state.accountAddress === '') {
      toast.warn('Please login into MetaMask first or just refresh!', {
        position: 'top-left',
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
        password: state.password,
      }),
    });

    const json = await response.json();
    if (json.success) {
      toast('🦊 Account has been created successfully!', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
    router.push('/login');
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <ToastContainer />

        <form onSubmit={onSubmit} className="max-w-sm mx-auto rounded-xl p-12" style={{ 'backgroundColor': 'rgb(233 32 99 / 85%)' }}>
          <div className="mb-4">
            <label htmlFor="accountAddress" className="block mb-1 font-semibold ">
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
              className="w-full bg-white cursor-not-allowed text-gray-400 px-4 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="accountType" className="block mb-1 font-semibold">
              Account Type
            </label>
            <select
              name="accountType"
              value={state.accountType}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option>Consumer</option>
              <option>Retailer</option>
            </select>
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
            <Link href="/login">
              <a className="text-gray-800 hover:text-blue-700">
                Already have an account?
              </a>
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
