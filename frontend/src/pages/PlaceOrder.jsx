import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContex';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const {
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
    setCartItems,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (Object.keys(cartItems).length === 0) {
        toast.error('Your cart is empty!');
        return;
      }

      setLoading(true);

      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const foundProduct = products.find((product) => product._id === items);
            if (foundProduct) {
              const itemInfo = JSON.parse(JSON.stringify(foundProduct)); // Safe clone
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { token },
          });

          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        default:
          toast.error('Selected payment method is not supported yet.');
          break;
      }

    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error(error?.response?.data?.message || 'Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className="flex gap-3">
          <input required name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='First Name' />
          <input required name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='Last Name' />
        </div>

        <input required name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="email" placeholder='Email Address' />
        <input required name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='Street' />

        <div className="flex gap-3">
          <input required name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='City' />
          <input required name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='State' />
        </div>

        <div className="flex gap-3">
          <input required name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='Zipcode' />
          <input required name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="text" placeholder='Country' />
        </div>

        <input required name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1 px-3.5 w-full' type="tel" placeholder='Phone' />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button type='submit' disabled={loading} className={`bg-black text-white px-16 py-3 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Placing Order...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
