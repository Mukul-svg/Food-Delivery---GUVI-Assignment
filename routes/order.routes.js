const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth, deliveryManAuth } = require('../middleware/auth.middleware');
const transactionLogger = require('../middleware/transaction-logger.middleware');
const Order = require('../models/order.model');
const DeliveryMan = require('../models/delivery-man.model');

// Place a new order (User)
router.post('/', authMiddleware, transactionLogger, async (req, res) => {
  try {
    const order = new Order({
      userId: req.user._id,
      foodItems: req.body.foodItems,
      totalPrice: req.body.totalPrice,
      status: 'pending'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View all orders (Admin only)
router.get('/', authMiddleware, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('foodItems.foodId')
      .populate('deliveryManId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View assigned orders (Delivery Man)
router.get('/assigned', authMiddleware, deliveryManAuth, async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryManId: req.user._id,
      status: { $in: ['accepted', 'in-transit'] }
    })
      .populate('userId', 'name email')
      .populate('foodItems.foodId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View specific order details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('foodItems.foodId')
      .populate('deliveryManId', 'name email');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        order.userId.toString() !== req.user._id.toString() &&
        (req.user.role === 'delivery' && order.deliveryManId?.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (Admin)
router.put('/:id/status', authMiddleware, adminAuth, transactionLogger, async (req, res) => {
  try {
    const { status, deliveryManId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (deliveryManId && status === 'accepted') {
      order.deliveryManId = deliveryManId;
      // Update delivery man's assigned orders
      await DeliveryMan.findByIdAndUpdate(
        deliveryManId,
        { $push: { assignedOrders: order._id } }
      );
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark order as delivered (Delivery Man)
router.put('/:id/delivered', authMiddleware, deliveryManAuth, transactionLogger, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryManId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or not assigned to you' });
    }

    order.status = 'completed';
    await order.save();

    // Remove from delivery man's assigned orders
    await DeliveryMan.findByIdAndUpdate(
      req.user._id,
      { $pull: { assignedOrders: order._id } }
    );

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;