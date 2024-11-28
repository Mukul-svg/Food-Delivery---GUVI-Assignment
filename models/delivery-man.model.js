const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deliveryManSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'delivery' },
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

deliveryManSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const DeliveryMan = mongoose.model('DeliveryMan', deliveryManSchema);
module.exports = DeliveryMan;