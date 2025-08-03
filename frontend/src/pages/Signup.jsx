import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('https://expense-tracker-fglu.onrender.com/api/auth/signup', formData);
            if (res.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
            console.error('Signup error:', errorMessage);
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
                        Start Your Financial Journey.
                    </h1>
                    <p className="mt-4 text-teal-100 max-w-sm">
                        Create an account to gain access to powerful tools that will help you track, budget, and save like a pro.
                    </p>
                </div>
            </div>

          
            <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Create an Account
                        </h2>
                        <p className="mt-2 text-slate-600">
                           It's quick, easy, and free to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                <p className="text-sm font-medium text-red-700">{error}</p>
                            </div>
                        )}
                        
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Username
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="johndoe"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                        </div>

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
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                            />
                            <p className="mt-2 text-xs text-slate-500">Password must be at least 6 characters.</p>
                        </div>

                       
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    
                    <p className="text-sm text-center text-slate-600 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
