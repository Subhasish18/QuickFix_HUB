import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../UserLandingPage/Navbar';
import Footer from '../UserLandingPage/Footer';
import logo from '../../assets/fix2.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; animation-fill-mode: both; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; animation-fill-mode: both; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; animation-fill-mode: both; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 4s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      <Navbar />

      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-72 h-72 bg-white/5 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white">
            {/* Logo + Brand */}
            <div className="mb-16 animate-fade-in-up">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/40 animate-glow">
                  <img src={logo} alt="Logo" className="w-20 h-20" />
                </div>
                <div className="ml-6">
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    QuickFixHub
                  </h1>
                  <p className="text-xl text-blue-200 font-medium mt-2">
                    Your Gateway to Trusted Solutions
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Message */}
            <div className="space-y-8 max-w-2xl animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-6xl font-bold leading-tight">
                Join Our Growing
                <span className="block text-transparent bg-gradient-to-r from-blue-200 to-white bg-clip-text">
                  Community
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Whether you need services or want to provide them, QuickFix connects you with the right people. 
                Experience seamless interactions, verified professionals, and quality results.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-200 text-sm uppercase tracking-wide">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">5K+</div>
                <div className="text-blue-200 text-sm uppercase tracking-wide">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-200 text-sm uppercase tracking-wide">Services</div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-16 space-y-6">
              {[
                { icon: "🎯", title: "Perfect Match", desc: "AI-powered matching system" },
                { icon: "⚡", title: "Lightning Fast", desc: "Quick responses and service" },
                { icon: "🔐", title: "Secure & Safe", desc: "Verified profiles and payments" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 animate-slide-in-left"
                  style={{ animationDelay: `${0.9 + i * 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{item.title}</div>
                    <div className="text-blue-200 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Role Selection */}
        <div className="w-full lg:w-2/5 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile Hero */}
            <div className="lg:hidden text-center mb-12 animate-fade-in-up">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center animate-glow">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">QuickFix</h1>
              <p className="text-lg text-gray-600">Join our community today</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 relative overflow-hidden animate-glow">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6 animate-pulse-ring">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Role</h2>
                  <p className="text-gray-600 text-lg">How do you want to use QuickFix?</p>
                </div>

                {/* Role Options */}
                <div className="space-y-6">
                  <div className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
                    <button
                      onClick={() => navigate('/signup/user')}
                      className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl font-bold mb-1">I am a User</h3>
                            <p className="text-blue-100 text-sm">Looking for reliable services</p>
                          </div>
                        </div>
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  <div className="animate-slide-in-right" style={{ animationDelay: '0.9s' }}>
                    <button
                      onClick={() => navigate('/signup/provider')}
                      className="group w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl font-bold mb-1">I am a Provider</h3>
                            <p className="text-green-100 text-sm">Ready to offer my services</p>
                          </div>
                        </div>
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-10 text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                  <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full border border-gray-200">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Free to join • Quick setup • Secure platform</span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                      Sign in here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;