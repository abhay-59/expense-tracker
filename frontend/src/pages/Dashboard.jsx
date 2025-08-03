// src/pages/Dashboard.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
// import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        category: '',
        description: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("https://expense-tracker-fglu.onrender.com/api/transactions", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTransactions(res.data);
        } catch (err) {
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("User object in Dashboard:", user);
        if (user) fetchTransactions();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {

        //console.log("Sending to backend:", dataToSend);
        e.preventDefault();
        const dataToSend = { ...formData };
        if (dataToSend.type === 'income') {
            //console.log("HAAN");
            delete dataToSend.category;
        }
        console.log("formData before sending:", formData);
        console.log("formData after formatting", dataToSend);
        try {
            await axios.post(
                "https://expense-tracker-fglu.onrender.com/api/transactions",
                dataToSend,
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            setFormData({ type: 'income', amount: '', category: '', description: '' });
            fetchTransactions();
        } catch (err) {
            console.error("Backend Error:", err.response?.data || err.message);
            setError('Failed to create transaction');
        }
    };

    const calculateTotals = () => {
        let income = 0, expense = 0;
        transactions.forEach((t) => {
            if (t.type === 'income') income += t.amount;
            else expense += t.amount;
        });
        return { income, expense };
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://expense-tracker-fglu.onrender.com/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchTransactions();
        } catch (err) {
            alert('Failed to delete transaction');
        }
    };

    const { income, expense } = calculateTotals();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("receipt", file);

        try {
            const res = await axios.post("https://expense-tracker-fglu.onrender.com/api/parse-receipt", formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const parsedTransactions = res.data.transactions;

            // Post each transaction to DB
            for (const t of parsedTransactions) {
                await axios.post("https://expense-tracker-fglu.onrender.com/api/transactions", t, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            }

            fetchTransactions(); // Refresh dashboard
            if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to parse or upload");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800 py-8 px-2 md:px-0">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-indigo-700">Welcome, {user?.name}</h2>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition" onClick={handleLogout}>Logout</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Total Income</h3>
                        <p className="text-2xl font-bold text-green-700">₹{income}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Total Expense</h3>
                        <p className="text-2xl font-bold text-red-700">₹{expense}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-700">Upload Receipt or Transaction image</h3>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                        ref={fileInputRef}
                        className="block mt-2 border border-indigo-400 rounded px-3 py-2 bg-white text-gray-700 cursor-pointer shadow-sm hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        style={{ maxWidth: '100%' }}
                    />
                </div>

                <form className="bg-white rounded-xl shadow p-6 mb-8" onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold mb-4 text-indigo-700">Add New Transaction</h3>
                    <div className="mb-4">
                        <label className="mr-2 font-semibold">Type:</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="border px-2 py-1 rounded">
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="mr-2 font-semibold">Amount:</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
                    </div>
                    {formData.type === 'expense' && (
                        <div className="mb-4">
                            <label className="mr-2 font-semibold">Category:</label>
                            <select name="category" value={formData.category} onChange={handleChange} required className="border px-2 py-1 rounded">
                                <option value="">--Select--</option>
                                <option value="food">Food</option>
                                <option value="fuel">Fuel</option>
                                <option value="shopping">Shopping</option>
                                <option value="travel">Travel</option>
                                <option value="misc">Misc</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="mr-2 font-semibold">Description:</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition">Add Transaction</button>
                </form>

                {loading ? (
                    <p className="text-center text-gray-500">Loading transactions...</p>
                ) : (
                    <div className="bg-white rounded-xl shadow p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-indigo-700">Transaction History</h3>
                        {transactions.length === 0 ? (
                            <p className="text-gray-500">No transactions yet.</p>
                        ) : (
                            <ul className="divide-y">
                                {transactions.map((t) => (
                                    <li key={t._id} className={`py-3 flex items-center ${t.type === 'income' ? 'text-green-700' : 'text-red-700'}`}> 
                                        <span className="mr-2 text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</span>
                                        <strong className="mr-2">{t.type.toUpperCase()}</strong> - ₹{t.amount}
                                        {t.category && <em className="ml-2 text-xs text-gray-500">({t.category})</em>}
                                        {t.description && <span className="ml-2 text-gray-600">- {t.description}</span>}
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="ml-auto text-red-500 hover:text-red-700 text-lg px-2 py-1 rounded focus:outline-none"
                                            title="Delete transaction"
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default Dashboard;
