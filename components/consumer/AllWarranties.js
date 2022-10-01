import React, {useState, useEffect} from 'react'
import { Card } from 'semantic-ui-react'

function AllWarranties() {

    // const [user, setUser] = useState({});
    let user;
    const [items, setItems] = useState([]);
    let cards = [];
    
    useEffect(() => {
        const getCards = async (accountAddress)=>{
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getwarranties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountAddress: accountAddress
                }),
            })
            const json = await response.json();
            setItems(json.warranties);
            console.log(json.warranties);

        }

        async function getUser() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const json = await response.json();

            if (json.success) {
                // setUser(json.user);
                getCards(json.user.accountAddress);
            }
            else {
                router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
            }
        }
        getUser();
        

        console.log('useeffect')

    }, [])

    const mapCards = ()=>{
        items.map((ele, index)=>{
            cards.push({
                header: 'Project Report - June',
                description: 'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
                meta: 'ROI: 27%',
            });
            console.log(ele);
        })
        return <Card.Group style={{ "width": "40%" }} items={cards} />
    }

    return (
        <div>
            {mapCards()}
        </div>
    )
}

export default AllWarranties