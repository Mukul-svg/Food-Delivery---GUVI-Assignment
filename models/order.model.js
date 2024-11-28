const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItems: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: Number
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  deliveryManId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryMan' }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;