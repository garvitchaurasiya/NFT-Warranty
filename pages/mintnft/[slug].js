import React from 'react'
import { useRouter } from 'next/router'

const Slug = () => {
  const router = useRouter();
  const {slug} = (router.query);
  console.log(slug, router.query)
  return (
    <div>Slug</div>
  )
}

export default Slug