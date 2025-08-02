// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['food', 'fuel', 'misc', 'shopping', 'travel', 'salary', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ['manual', 'receipt', 'pdf'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
