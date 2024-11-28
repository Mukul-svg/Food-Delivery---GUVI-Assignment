const TransactionLog = require('../models/transaction-log.model');

const transactionLogger = async (req, res, next) => {
  try {
    if (req.user) {
      await TransactionLog.create({
        actionType: `${req.method} ${req.path}`,
        userId: req.user._id,
        details: {
          body: req.body,
          params: req.params
        }
      });
    }
    next();
  } catch (error) {
    console.error('Logging error:', error);
    next();
  }
};

module.exports = transactionLogger;