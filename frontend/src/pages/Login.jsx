import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added for loading state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('https://expense-tracker-fglu.onrender.com/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            const fullUser = {
                ...res.data.user,
                token: res.data.token,
            };
            login(fullUser);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
            console.error('Login error:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">

            <div className="hidden lg:flex flex-col items-center justify-center bg-teal-600 text-white p-12">
                <Link to="/" className="text-4xl font-black tracking-tight text-white mb-6">
                    Trackwise
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold leading-tight">
                        Rediscover Financial Control.
                    </h1>
                    <p className="mt-4 text-teal-100 max-w-sm">
                        Login to access your personalized dashboard and continue your journey towards financial clarity.
                    </p>
                </div>
                
            </div>

            
            <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-slate-600">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <p className="text-sm font-medium text-red-700">{error}</p>
                            </div>
                        )}

                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    <p className="text-sm text-center text-slate-600 mt-8">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;