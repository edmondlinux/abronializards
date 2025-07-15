'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import CloudinaryImage from '@/components/CloudinaryImage'
import { useEffect } from 'react'
import SEO from '@/components/SEO'

const OrderPlaced = () => {

  const { router } = useAppContext()

  useEffect(() => {
    setTimeout(() => {
      router.push('/my-orders')
    }, 9000)
  }, [])

  return (
    <>
      <SEO
        title="Order Placed | Abronia Lizards"
        description="Order confirmation page"
        canonical="https://abronializards.com/order-placed"
        url="https://abronializards.com/order-placed"
        robots="noindex, nofollow"
        openGraph={{
          type: 'website',
          siteName: 'Abronia Lizards',
        }}
        twitter={{
          card: 'summary_large_image',
          site: '@abronializards',
          creator: '@abronializards',
        }}
      />
      <div className='h-screen flex flex-col justify-center items-center gap-5'>
        <div className="flex justify-center items-center relative">
          <CloudinaryImage className="absolute p-5" src={assets.checkmark} alt='Order placed checkmark' />
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
        </div>
        <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      </div>
    </>
  )
}

export default OrderPlaced
