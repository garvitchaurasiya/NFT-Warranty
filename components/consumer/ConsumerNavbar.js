import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import Router from 'next/router';
import Home from './Home';
import AllWarranties from './AllWarranties'

function ConsumerNavbar() {
    const [activate, setActivate] = useState("home");

    const [state, setState] = useState({
        home: true,
        warranties: false,
    })

    const handleHome = () => {
        setActivate('home');
        setState({ home: true })
        console.log((state.warranties) ? 'block' : 'none');
    };

    const getWarranties = () => {
        setActivate('warranties');
        setState({ warranties: true })
        console.log((state.warranties) ? 'block' : 'none');
    }

    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        Router.push('/login');
    }

    return (
        <div>
            <Menu pointing secondary>
                <Menu.Item
                    name='home'
                    active={activate === 'home'}
                    onClick={handleHome}
                />
                <Menu.Item
                    name='warranties'
                    active={activate === 'warranties'}
                    onClick={getWarranties}
                />

                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        active={activate === 'logout'}
                        onClick={handleLogout}
                    />
                </Menu.Menu>
            </Menu>

            {state.home && <Home />}

            <div style={{ 'display': (state.warranties) ? 'block' : 'none' }} >
                <AllWarranties />
            </div>

        </div>
    )
}

export default ConsumerNavbar