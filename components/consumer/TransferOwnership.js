import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import warranty from '../../ethereum/warranty';
import web3 from '../../ethereum/web3';
import Loader from '../Loader';

function TransferOwnership() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  let currentdate = new Date().toISOString().slice(0, 10);

  const [state, setState] = useState({
    accountAddress: '',
    sendTo: '',
    id: '',
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (json.success) {
        setState({ ...state, accountAddress: json.user.accountAddress });
      } else {
        router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
      }
    }

    getUser();
  }, []);

  const transfer = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accounts = await web3.eth.getAccounts();
      await warranty.methods.safeTransferFrom(state.accountAddress, state.sendTo, state.id).send({ from: accounts[0] });

      // Remove from previous owner

      setLoading(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatewarranties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountAddress: state.accountAddress,
          sendTo: state.sendTo,
          tokenId: state.id,
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      setLoading(false);
      console.log('Some error occurred', error.message);
    }
  };

  return (
    <div className="mt-8">
      {loading && <Loader message="Transfering Ownership..."/>}

      <form onSubmit={transfer} className="max-w-md mx-auto p-16 rounded-xl" style={{'backgroundColor':'rgb(233 32 99 / 80%)'}}>
        <div className="mb-4">
          <label htmlFor="accountAddress" className="block mb-2 font-bold">Account Address</label>
          <input
            onChange={onChange}
            name="accountAddress"
            value={state.accountAddress}
            type="text"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Transfer Ownership To</label>
          <input
            type="text"
            name="sendTo"
            value={state.sendTo}
            onChange={onChange}
            required
            placeholder="Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">ID</label>
          <input
            type="number"
            name="id"
            value={state.id}
            onChange={onChange}
            required
            placeholder="#id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-black rounded hover:bg-gray-900"
          >
            Transfer
          </button>
        </div>
      </form>

    </div>
  );
}

export default TransferOwnership;
