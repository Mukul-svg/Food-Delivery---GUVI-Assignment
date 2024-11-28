const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
  actionType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: mongoose.Schema.Types.Mixed }
});

const TransactionLog = mongoose.model('TransactionLog', transactionLogSchema);
module.exports = TransactionLog;