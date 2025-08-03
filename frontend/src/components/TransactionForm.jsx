import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function TransactionForm({ onAdd }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = user?.token;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/transactions",
        { type, amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAdd(res.data);
      setAmount('');
      setCategory('');
    } catch (err) {
      console.error('Error creating transaction', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-6">
      <div className="mb-4">
        <label className="mr-2 font-semibold">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border px-2 py-1">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount"
          className="border px-3 py-2 w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      {type === 'expense' && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category"
            className="border px-3 py-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
      )}
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;
