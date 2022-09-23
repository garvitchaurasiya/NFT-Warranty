import React from 'react'
import { useRouter } from 'next/router'
import warranty from '../../ethereum/warranty.js';
import web3 from '../../ethereum/web3';


const Slug = (props) => {
  const router = useRouter();
  const {slug} = (router.query);
  // console.log(slug, router.query)
  console.log(props.totalSupply)

  return (
    <div>
      Hii
    </div>
  )
}

export async function getServerSideProps(context) {

  const totalSupply = await warranty.methods.totalSupply().call();
  console.log(totalSupply, context.query)


  

  return {
      props: {totalSupply}, // will be passed to the page component as props
  }
}

export default Slug