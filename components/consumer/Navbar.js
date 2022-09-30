import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import Router from 'next/router';

function Navbar() {
    const [activate, setActivate] = useState("home");
    const handleItemClick = (e, { name }) => setActivate(name);

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
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='warranties'
                    active={activate === 'warranties'}
                    onClick={handleItemClick}
                />

                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        active={activate === 'logout'}
                        onClick={handleLogout}
                    />
                </Menu.Menu>
            </Menu>

        </div>
    )
}

export default Navbar