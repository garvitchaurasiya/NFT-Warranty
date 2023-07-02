import React, { useState } from 'react';
import Router from 'next/router';
import AllWarranties from './AllWarranties';
import TransferOwnership from './TransferOwnership';

function ConsumerNavbar() {
  const [activate, setActivate] = useState('warranties');

  const [state, setState] = useState({
    warranties: true,
    transferOwnership: false,
    about: false
  });

  const getWarranties = () => {
    setActivate('warranties');
    setState({ warranties: true });
  };

  const transferOwnership = () => {
    setActivate('transferOwnership');
    setState({ transferOwnership: true });
  };

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    Router.push('/login');
  };

  return (
    <div>
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                className={`${activate === 'warranties' ? '' : 'font-bold text-gray-400'
                  } px-3 py-2 text-sm font-medium`}
                onClick={getWarranties}
              >
                Warranties
              </button>
              <button
                className={`${activate === 'transferOwnership' ? '' : 'font-bold text-gray-400'
                  } px-3 py-2 text-sm font-medium`}
                onClick={transferOwnership}
              >
                Transfer Ownership
              </button>
              <button
                className={`${activate === 'about' ? '' : 'font-bold text-gray-400'
                  } px-3 py-2 text-sm font-medium`}
                onClick={() => {
                  setActivate('about');
                  // setState({ about: true });
                }}
              >
                About
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="text-gray-400 px-3 py-2 text-sm font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={state.warranties ? 'block' : 'hidden'}>
        <AllWarranties />
      </div>

      {state.transferOwnership && <TransferOwnership />}
    </div>
  );
}

export default ConsumerNavbar;
