import React from 'react';
import { Link } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';


const samplePieData = {
  labels: ['Services', 'Products', 'Utilities', 'Marketing'],
  datasets: [
    {
      label: 'Revenue by Source',
      data: [550, 300, 150, 250],
      
      backgroundColor: ['#0D9488', '#F59E0B', '#EF4444', '#3B82F6'], 
      borderColor: '#fff',
      borderWidth: 2,
    },
  ],
};

const sampleLineData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Monthly Profit',
      data: [650, 590, 800, 810, 560],
      fill: true,
      
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
     
      borderColor: '#0D9488', 
      tension: 0.4,
      
      pointBackgroundColor: '#0D9488',
      pointBorderColor: '#fff',
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#fff',
      
      pointHoverBorderColor: '#0D9488',
    },
  ],
};


const FeatureIcon = ({ children }) => (
  
  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-teal-100 text-teal-600">
    {children}
  </div>
);

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
        <div className="container mx-auto flex items-center justify-between p-4 h-20">
          <Link to="/" className="text-4xl font-black text-teal-600 tracking-tight"> 
            Trackwise
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 font-medium text-slate-600 hover:text-teal-600 transition-colors rounded-lg"> 
              Login
            </Link>
            <Link to="/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        
        <section className="text-center py-24 sm:py-32 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
            Financial Clarity, <span className="text-teal-600">Visualized.</span>  
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600">
            Trackwise is the effortless way to manage your finances. Gain insights, track spending, and achieve your financial goals with our beautiful, intuitive dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"> 
              Get Started for Free
            </Link>
          </div>
        </section>
        
       
        <section className="py-20 px-4 bg-white border-y border-slate-200/80">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything You Need to Take Control</h2>
                    <p className="mt-4 text-lg text-slate-600">One platform, all your financial data simplified.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                    <div className="text-center">
                        <FeatureIcon>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.243-6.75.72A48.416 48.416 0 0012 4.5z" /></svg>
                        </FeatureIcon>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Track Spending</h3>
                        <p className="mt-2 text-slate-500">Easily categorize transactions to see where your money goes each month.</p>
                    </div>
                    <div className="text-center">
                        <FeatureIcon>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2" /></svg>
                        </FeatureIcon>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Visualize Insights</h3>
                        <p className="mt-2 text-slate-500">Interactive charts help you understand your financial habits at a glance.</p>
                    </div>
                    <div className="text-center">
                        <FeatureIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                        </FeatureIcon>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Budget Smarter</h3>
                        <p className="mt-2 text-slate-500">Set monthly budgets and get alerts to stay on track with your goals.</p>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="py-24 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your Finances, Beautifully Displayed</h2>
                    <p className="mt-4 text-lg text-slate-600">Go beyond spreadsheets with powerful, easy-to-read charts.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white shadow-xl shadow-slate-200/70 p-8 rounded-2xl border border-slate-200/80">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">Revenue by Source</h3>
                        <Pie data={samplePieData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                    <div className="bg-white shadow-xl shadow-slate-200/70 p-8 rounded-2xl border border-slate-200/80">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">Monthly Profit Trend</h3>
                        <Line data={sampleLineData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200/80">
        <div className="container mx-auto text-center py-8">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Trackwise. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 mt-2">
             Designed with ❤️ by Abhay.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;