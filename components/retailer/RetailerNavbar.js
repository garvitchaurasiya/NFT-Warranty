import React, {useState} from 'react'
import { Menu } from 'semantic-ui-react'
import Router from 'next/router';
import Home from './Home';
import CreateWarranty from './CreateWarranty';

function Navbar() {
    const [activate, setActivate] = useState("home");
    const [state, setState] = useState({
        home: true,
        createWarranty: false,
    })
    
    const handleHome = ()=>{
        setActivate('home');
        setState({home: true})
    };


    const handleLogout = async()=>{
        await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        Router.push('/login');
    }
    const createWarranty = ()=>{
        setActivate('createWarranty');
        setState({createWarranty: true})
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
                    name='createWarranty'
                    active={activate === 'createWarranty'}
                    onClick={createWarranty}
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        active={activate === 'logout'}
                        onClick={handleLogout}
                    />
                </Menu.Menu>
            </Menu>
            { state.home && <Home/>}
            { state.createWarranty && <CreateWarranty/>}
        </div>
    )
}

export default Navbar