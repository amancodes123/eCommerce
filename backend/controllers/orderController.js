import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing orders using COD Method
const placeOrder = async (req , res) =>{

    try {
         const userId = req.user.id; 
        const {  items, amount , address } = req.body;
        if(!userId || !items || !amount || !address) {
  return res.status(400).json({success:false, message:"Missing required fields"});
}


        const orderData = {
          user:  userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success: true, message:"Order Placed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req , res) =>{

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req , res) =>{

}


// All Orders data for Admin Panel
const allOrders = async (req , res) =>{
try {
    const orders = await orderModel.find({});
    res.json({success:true,orders})
} catch (error) {
     console.log(error);
        res.json({success:false,message:error.message})
}
}


// User Order Data for Frontend
const userOrders = async (req , res) =>{
    try {
  const userId = req.user.id;


       const orders = await orderModel.find({ user: userId })
console.log('User orders:', orders);

        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Update order status from Admin Panel
const updateStatus = async (req , res) =>{

}

export { placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,userOrders,updateStatus }