// src/pages/Dashboard.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import './Dashboard.css';

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
            const res = await axios.get("http://localhost:5000/api/transactions", {
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
                "http://localhost:5000/api/transactions",
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
            const res = await axios.post("http://localhost:5000/api/parse-receipt", formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const parsedTransactions = res.data.transactions;

            // Post each transaction to DB
            for (const t of parsedTransactions) {
                await axios.post("http://localhost:5000/api/transactions", t, {
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
        <div className="dashboard">
            <h2>Welcome, {user?.email}</h2>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            <div className="summary-cards">
                <div className="card income-card">
                    <h3>Total Income</h3>
                    <p>₹{income}</p>
                </div>
                <div className="card expense-card">
                    <h3>Total Expense</h3>
                    <p>₹{expense}</p>
                </div>
            </div>
            <div className="card upload-card">
                <h3>Upload Receipt or Transaction image</h3>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                    ref={fileInputRef}
                />
            </div>

            <form className="transaction-form" onSubmit={handleSubmit}>
                <h3>Add New Transaction</h3>
                <label>
                    Type:
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </label>

                <label>
                    Amount:
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>

                {formData.type === 'expense' && (
                    <label>
                        Category:
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">--Select--</option>
                            <option value="food">Food</option>
                            <option value="fuel">Fuel</option>
                            <option value="shopping">Shopping</option>
                            <option value="travel">Travel</option>
                            <option value="misc">Misc</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                )}

                <label>
                    Description:
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </label>

                <button type="submit">Add Transaction</button>
            </form>

            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <div className="history">
                    <h3>Transaction History</h3>
                    {transactions.length === 0 ? (
                        <p>No transactions yet.</p>
                    ) : (
                        <ul>
                            {transactions.map((t) => (
                                <li key={t._id} className={t.type}>
                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                    <strong>{t.type.toUpperCase()}</strong> - ₹{t.amount}
                                    {t.category && <em> ({t.category})</em>}
                                    {t.description && <span> - {t.description}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Dashboard;
