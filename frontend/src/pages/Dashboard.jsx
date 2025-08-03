// src/pages/Dashboard.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

// 📊 1. CHART IMPORTS
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// 📊 2. REGISTER CHARTJS COMPONENTS
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

// --- Helper Components & Icons for a cleaner look ---
const StatCard = ({ title, amount, colorClass, children }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${colorClass}`}>
        <div className="flex items-center gap-4">
            <div className="text-3xl">{children}</div>
            <div>
                <p className="text-slate-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800">₹{amount.toLocaleString('en-IN')}</p>
            </div>
        </div>
    </div>
);

const TransactionIcon = ({ type }) => {
    const isIncome = type === 'income';
    const bgColor = isIncome ? 'bg-emerald-100' : 'bg-rose-100';
    const iconColor = isIncome ? 'text-emerald-600' : 'text-rose-600';
    return (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
            {isIncome ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            )}
        </div>
    );
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user?.token) {
                setError('Authentication error. Please log in again.');
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("https://expense-tracker-fglu.onrender.com/api/transactions", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = Array.isArray(res.data) ? res.data : [];
                setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (err) {
                setError('Failed to fetch transactions.');
                setTransactions([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user]);

    const { income, expense } = transactions.reduce((acc, t) => {
        if (t.type === 'income') {
            acc.income += t.amount;
        } else {
            acc.expense += t.amount;
        }
        return acc;
    }, { income: 0, expense: 0 });

    const balance = income - expense;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        setError('');
        
        const dataToSend = {
            ...formData,
            amount: Number(formData.amount)
        };
        if (dataToSend.type === 'income') {
            delete dataToSend.category;
        }

        try {
            const createRes = await axios.post("https://expense-tracker-fglu.onrender.com/api/transactions", dataToSend, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Add new transaction to the top and re-sort
            setTransactions(prev => 
                [...prev, createRes.data].sort((a, b) => new Date(b.date) - new Date(a.date))
            );
            
            setFormData({ type: 'expense', amount: '', category: '', description: '' });
        } catch (err) {
            setError('Failed to create transaction. Please try again.');
        } finally {
            setFormSubmitting(false);
        }
    };
    
    const handleDelete = async (id) => {
        const originalTransactions = [...transactions];
        setTransactions(transactions.filter(t => t._id !== id));
        try {
            await axios.delete(`https://expense-tracker-fglu.onrender.com/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
        } catch (err) {
            setError('Failed to delete transaction. Reverting changes.');
            setTransactions(originalTransactions);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append("receipt", file);

        try {
            const res = await axios.post("https://expense-tracker-fglu.onrender.com/api/parse-receipt", uploadFormData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            await Promise.all(res.data.transactions.map(t =>
                axios.post("https://expense-tracker-fglu.onrender.com/api/transactions", t, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ));
            
            const newRes = await axios.get("https://expense-tracker-fglu.onrender.com/api/transactions", { headers: { Authorization: `Bearer ${user.token}` } });
            setTransactions(newRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            
        } catch (err) {
            setError("Failed to parse or upload receipt.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const { pieChartData, barChartData } = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');

        const categoryTotals = expenses.reduce((acc, t) => {
            const category = t.category || 'misc';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});

        const pieData = {
            labels: Object.keys(categoryTotals).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#64748b', '#ec4899'],
                borderColor: '#fff',
                borderWidth: 2,
            }]
        };

        const monthlyTotals = {};
        expenses.forEach(t => {
            const monthYear = new Date(t.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
            monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + t.amount;
        });

        const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
            const dateA = new Date(`01 ${a.replace("'", " 20")}`);
            const dateB = new Date(`01 ${b.replace("'", " 20")}`);
            return dateA - dateB;
        });

        const barData = {
            labels: sortedMonths,
            datasets: [{
                label: 'Total Expenses',
                data: sortedMonths.map(month => monthlyTotals[month]),
                backgroundColor: '#0d9488',
                borderRadius: 4,
            }]
        };

        return { pieChartData: pieData, barChartData: barData };
    }, [transactions]);

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 20, font: { family: 'Inter, sans-serif' } }
            }
        },
    };
    
    const barChartOptions = {
        ...commonChartOptions,
        plugins: { ...commonChartOptions.plugins, legend: { display: false } },
        scales: {
            y: { ticks: { callback: value => `₹${value >= 1000 ? `${value / 1000}k` : value}` } }
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-100 antialiased">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*,application/pdf"
                        />
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 text-sm font-semibold text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                            Upload Receipt
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-700">Welcome back, {user?.name}!</h2>
                    <p className="text-slate-500">Here's your financial overview.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert"><p>{error}</p></div>}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="TOTAL BALANCE" amount={balance} colorClass="border-slate-500">💰</StatCard>
                            <StatCard title="TOTAL INCOME" amount={income} colorClass="border-emerald-500">📈</StatCard>
                            <StatCard title="TOTAL EXPENSE" amount={expense} colorClass="border-rose-500">📉</StatCard>
                        </section>
                        
                        <section>
                             <h3 className="text-xl font-bold text-slate-800 mb-4">Visual Insights</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h4 className="text-lg font-semibold text-slate-700 mb-2">Expense Breakdown</h4>
                                    <div className="h-72">
                                        {expense > 0 ? (
                                            <Pie data={pieChartData} options={commonChartOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-500">No expense data to display.</div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                     <h4 className="text-lg font-semibold text-slate-700 mb-2">Monthly Spending</h4>
                                     <div className="h-72">
                                        {expense > 0 ? (
                                            <Bar data={barChartData} options={barChartOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-500">No spending data available.</div>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </section>
                        
                        <section className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h3>
                            {loading ? (
                                <div className="text-center py-8 text-slate-500">Loading transactions...</div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">No transactions recorded yet.</div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {transactions.map(t => (
                                        <li key={t._id} className="flex items-center gap-4 py-4">
                                            <TransactionIcon type={t.type} />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-slate-700 capitalize">{t.description || t.type}</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {t.category && ` • ${t.category}`}
                                                </p>
                                            </div>
                                            <div className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                            </div>
                                            <button onClick={() => handleDelete(t._id)} className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                    
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-28">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Add Transaction</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Type</label>
                                    <div className="flex gap-2">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.type === 'expense' ? 'bg-rose-50 border-rose-400' : 'bg-slate-50 border-slate-300'}`}>
                                            <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleChange} className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300" />
                                            <span className="font-medium text-slate-700">Expense</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.type === 'income' ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-300'}`}>
                                            <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleChange} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300" />
                                            <span className="font-medium text-slate-700">Income</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                    <input id="amount" type="number" name="amount" placeholder="0.00" value={formData.amount} onChange={handleChange} required className="block w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <input id="description" type="text" name="description" placeholder="e.g., Coffee with friends" value={formData.description} onChange={handleChange} required className="block w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>

                                {formData.type === 'expense' && (
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <select id="category" name="category" value={formData.category} onChange={handleChange} required className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                                            <option value="">Select a category</option>
                                            <option value="food">Food</option>
                                            <option value="fuel">Fuel</option>
                                            <option value="shopping">Shopping</option>
                                            <option value="travel">Travel</option>
                                            <option value="bills">Bills</option>
                                            <option value="misc">Misc</option>
                                        </select>
                                    </div>
                                )}
                                
                                <button type="submit" disabled={formSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-teal-400">
                                    {formSubmitting ? 'Adding...' : 'Add Transaction'}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;