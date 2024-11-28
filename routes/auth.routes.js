const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const DeliveryMan = require('../models/delivery-man.model');
const bcrypt = require('bcryptjs');

router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login-delivery-man', async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryMan = await DeliveryMan.findOne({ email });
    if (!deliveryMan || !await bcrypt.compare(password, deliveryMan.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: deliveryMan._id, role: 'delivery' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email or username is already registered
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password, // Password will be hashed automatically by the pre-save hook
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register-delivery-man', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingDeliveryMan = await DeliveryMan.findOne({ email });
    if (existingDeliveryMan) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new delivery man
    const newDeliveryMan = new DeliveryMan({
      name,
      email,
      password, // Password will be hashed automatically by the pre-save hook
    });

    await newDeliveryMan.save();
    res.status(201).json({ message: 'Delivery Man registered successfully', deliveryMan: newDeliveryMan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register-user', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed automatically by the pre-save hook
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;