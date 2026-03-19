const express = require('express');
const router = express.Router();
const { createTransaction, updateTransactionStatus, getGroupTransactions, recordSettlement, deleteTransaction} = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.post('/add', auth, createTransaction);
router.patch('/vote/:id', auth, updateTransactionStatus);
router.get('/group/:groupId', auth, getGroupTransactions);
router.post('/settle', auth, recordSettlement);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;