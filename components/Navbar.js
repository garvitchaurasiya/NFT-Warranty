import React, { useState } from 'react';
import Router from 'next/router';

function Navbar() {
  const [activate, setActivate] = useState('');

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    Router.push('/login');
  };

  const about = () => {
    setActivate('about');
  };

  return (
    <div>

      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className='flex'>
              <button
                className={`menu-item ${
                  activate === 'nft-warranty' ? '' : 'font-bold text-gray-400'
                } px-3 py-2 text-sm font-medium`}
                onClick={()=>{setActivate('nft-warranty')}}
              >
                NFT-Warranty
              </button>
              <button
                className={`menu-item ${
                  activate === 'about' ? '' : 'font-bold text-gray-400'
                } px-3 py-2 text-sm font-medium`}
                onClick={about}
              >
                About
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="text-gray-400 px-3 py-2 text-sm font-medium"
                onClick={handleLogout}
              >
                Login / Signup
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
