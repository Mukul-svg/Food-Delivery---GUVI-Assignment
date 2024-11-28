require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');
const logRoutes = require('./routes/log.routes');

const app = express();

//Setting Strinct Query to False to avoid warnings
mongoose.set('strictQuery', false);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/foods', foodRoutes);
app.use('/orders', orderRoutes);
app.use('/logs', logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});