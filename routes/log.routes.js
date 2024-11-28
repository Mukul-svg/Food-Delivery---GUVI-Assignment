const express = require('express');
const router = express.Router();
const { authMiddleware, adminAuth } = require('../middleware/auth.middleware');
const TransactionLog = require('../models/transaction-log.model');

// View transaction logs (Admin only)
router.get('/', authMiddleware, adminAuth, async (req, res) => {
  try {
    const logs = await TransactionLog.find()
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;