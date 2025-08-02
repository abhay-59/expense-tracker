import React from 'react';
import { Link } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const samplePieData = {
  labels: ['Food', 'Fuel', 'Misc'],
  datasets: [
    {
      label: 'Expenses by Category',
      data: [4500, 2000, 1500],
      backgroundColor: ['#4F46E5', '#F59E0B', '#EF4444'],
    },
  ],
};

const sampleLineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Monthly Expenses',
      data: [4000, 3000, 5000, 3500],
      borderColor: '#4F46E5',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
    },
  ],
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800">
      <header className="p-6 flex justify-between items-center shadow-md bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-indigo-600">Finance Assistant</h1>
        <div>
          <Link to="/login" className="mr-4 text-indigo-600 hover:underline font-medium">Login</Link>
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition">Sign Up</Link>
        </div>
      </header>

      <section className="text-center py-20 px-6">
        <h2 className="text-5xl font-extrabold mb-6 leading-tight text-indigo-700">Track Your Money.<br />Visualize Your Life.</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your intelligent finance dashboard to manage income, monitor expenses, scan receipts, and gain deep financial insight.
        </p>
        <div className="mt-8">
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow">Get Started</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 px-10 py-16 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Expenses by Category</h3>
          <Pie data={samplePieData} />
        </div>
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Monthly Spending Trend</h3>
          <Line data={sampleLineData} />
        </div>
      </section>

      <footer className="text-center p-6 border-t text-sm text-gray-500">
        &copy; 2025 Finance Assistant. Built with ❤️ by Abhay Singh
      </footer>
    </div>
  );
}

export default LandingPage;
