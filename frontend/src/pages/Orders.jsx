import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContex'
import Title from '../components/Title'
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false)

  const loadOrderData = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/userorder', {}, { headers: { token } })
      console.log('Order Data:', response.data.orders)

      setOrderData(response.data.orders || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  if (loading) return <p>Loading orders...</p>
  if (!orderData.length) return <p>No orders found.</p>

  return (
    <div className='border-t pt-16'>
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((order, orderIndex) => (
          <div key={orderIndex} className='mb-8'>
            {/* <h3 className='mb-4 font-semibold'>Order Date: {new Date(order.date).toLocaleDateString()}</h3> */}
            {order.items.map((item, index) => (
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img
                    className='w-16 sm:w-20'
                    src={item.image && item.image.length > 0 ? item.image[0] : ''}
                    alt={`Image of ${item.name}`}
                  />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p className='text-lg'>{currency}{item.price}</p>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>Size: {item.size || 'M'}</p>
                      <p className='text-gray-400'><span>Order Date: {new Date(order.date).toDateString()}</span></p>
                      <p className='text-gray-400'> Payment Method: {order.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{order.status}</p>
                  </div>
                  <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
