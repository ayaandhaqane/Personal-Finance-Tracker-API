import express from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
  getMonthlySummary
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { transactionSchema, updateTransactionSchema, monthlySummarySchema } from '../validators/schemas.js';

const router = express.Router();

//  GET /api/transactions

router.get('/', protect, getTransactions);

//  GET /api/transactions/stats

router.get('/stats', protect, getStats);

//  GET /api/transactions/monthly-summary

router.get('/monthly-summary', protect, getMonthlySummary);

//GET /api/transactions/:id

router.get('/:id', protect, getTransaction);

// POST /api/transactions

router.post('/', protect, validate(transactionSchema), createTransaction);

// PUT /api/transactions/:id

router.put('/:id', protect, validate(updateTransactionSchema), updateTransaction);

// DELETE /api/transactions/:id

router.delete('/:id', protect, deleteTransaction);

export default router;

