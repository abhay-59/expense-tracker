
import express from 'express';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from '../controllers/transactionController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(authMiddleware);

router.post('/', createTransaction);          // POST /api/transactions
router.get('/', getTransactions);             // GET /api/transactions
router.delete('/:id', deleteTransaction);     // DELETE /api/transactions/:id

export default router;
