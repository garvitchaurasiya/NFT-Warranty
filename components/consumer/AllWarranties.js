import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import 'semantic-ui-css/semantic.min.css'
import warranty from '../../ethereum/warranty'
import web3 from '../../ethereum/web3';

function AllWarranties() {

    const Router = useRouter();

    let allTokenIds = [];

    async function getMetadata(tokenId) {
        const accounts = await web3.eth.getAccounts();
        const uri = await warranty.methods.tokenURI(tokenId).call();

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getmetadata/${uri}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const json = await response.json();

        const today = new Date().toISOString().slice(0, 10)
        // if(today > json.warrantyExpiryDate){
        //     return;
        // }

        const a = document.createElement('a');
        a.className = "ui card";
        const content = document.createElement('div');
        content.className = "content"

        const header = document.createElement('div');
        header.className = "header";
        header.innerHTML = json.model

        const meta = document.createElement('div');
        meta.className = "meta";
        meta.innerHTML = '#' + tokenId + ' ' + json.serialNumber

        const description = document.createElement('div');
        description.className = "description";
        description.innerHTML = json.warrantyExpiryDate

        content.appendChild(header);
        content.appendChild(meta);
        content.appendChild(description);

        a.appendChild(content);
        document.querySelector('#cardsContainer').appendChild(a);

    }

    const mapCards = () => {
        allTokenIds.map((ele, index) => {
            getMetadata(ele);
        })
    }
    const myPromise = new Promise((resolve, reject) => {

        const getCards = async (accountAddress) => {

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
            allTokenIds = json.warranties

            resolve(json.warranties);

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
                getCards(json.user.accountAddress);
            }
            else {
                console.log("please login")
                Router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
            }
        }
        getUser();
    });



    useEffect(() => {
        myPromise.then((data) => {
            mapCards();
        });
    }, [Router.pathname])

    return (<>
        <div id="cardsContainer">

        </div>
    </>
    )
}

export default AllWarranties