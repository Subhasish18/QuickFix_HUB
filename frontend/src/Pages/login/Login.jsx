import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import auth from '../../utils/Firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../UserLandingPage/Navbar';
import Footer from '../UserLandingPage/Footer';
import logo from '../../assets/fix2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Attempt admin login
      const response = await axios.post('https://quickfix-hub.onrender.com/api/login', {
        email,
        password,
      });

      if (response.data.user && response.data.user.role === 'admin') {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        toast.success('Admin login successful ✅', { toastId: 'admin-login' });
        navigate('/admin');
      } else {
        throw new Error('Not an admin.');
      }
    } catch (adminError) {
      // Step 2: Firebase login for regular users
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        const loginResponse = await axios.post('https://quickfix-hub.onrender.com/api/login', {}, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const userData = loginResponse.data.user;
        localStorage.setItem('userData', JSON.stringify(userData));

        if (userData.profileComplete === false) {
          toast.info('Welcome! Please complete your profile ℹ️', { toastId: 'profile-incomplete' });
          navigate('/additional-details/user');
        } else {
          toast.success('Login successful 🎉', { toastId: 'user-login' });
          navigate('/');
        }
      } catch (firebaseError) {
        let errorMessage = 'Failed to log in. Please check your credentials.';
        if (firebaseError.code) {
          switch (firebaseError.code) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email. Please sign up.';
              break;
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              errorMessage = 'Incorrect email or password. Please try again.';
              break;
            default:
              errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
        setError(errorMessage);
        toast.error(errorMessage, { toastId: 'login-failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post('https://quickfix-hub.onrender.com/api/login', {}, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const userData = response.data.user;
      localStorage.setItem('userData', JSON.stringify(userData));

      if (userData.profileComplete === false) {
        toast.info('Welcome! Please complete your profile ℹ️', { toastId: 'google-profile-incomplete' });
        navigate('/additional-details/user');
      } else {
        toast.success('Signed in with Google 🚀', { toastId: 'google-login' });
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message, { toastId: 'google-login-failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation Bar */}
      <Navbar />

      <div className="flex min-h-screen">
        {/* Left Side - Company Information */}
                <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 relative overflow-hidden">
                  {/* Overlay effects */}
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="absolute top-12 left-12 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-24 right-24 w-56 h-56 bg-white/5 rounded-full blur-2xl animate-bounce-slow"></div>
                  <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-center px-14 py-16 text-white">
                    
                    {/* Logo + Brand */}
                    <div className="mb-12 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/40">
                        <img src={logo} alt="QuickFixHub Logo" className="w-16 h-16" />
                      </div>
                      <h1 className="mt-6 text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        QuickFixHub
                      </h1>
                      <p className="mt-3 text-xl text-blue-200 font-medium">
                        Where Everyday Problems Meet Trusted Solutions
                      </p>
                    </div>

                    {/* Story / Vision */}
                    <div className="space-y-6 text-center max-w-md mx-auto">
                      <h2 className="text-3xl font-semibold leading-snug">
                        One Platform. Endless Services. Zero Hassle.
                      </h2>
                      <p className="text-lg text-blue-100 leading-relaxed">
                        Whether it’s fixing a leaky tap, finding a tutor, or hiring a designer — 
                        we connect you with trusted, verified professionals who deliver quality and reliability.
                      </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="mt-10 space-y-4">
                      {[
                        { icon: "✓", text: "Verified & Skilled Experts" },
                        { icon: "⚡", text: "Fast, Reliable Service" },
                        { icon: "🔒", text: "Secure & Transparent Process" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center space-x-3 animate-slide-in-left"
                          style={{ animationDelay: `${1.2 + i * 0.3}s` }}
                        >
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">{item.icon}</span>
                          </div>
                          <span className="text-blue-100 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social proof */}
                    <div className="pt-10 text-center">
                      <div className="inline-flex items-center px-6 py-3 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:bg-opacity-25 transition-all duration-300">
                        <span className="text-sm font-semibold">
                          🚀 Trusted by 10,000+ Families & Businesses
                        </span>
                      </div>
                    </div>
                  </div>
                </div>



        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Mobile Logo */}
            <div className="lg:hidden text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-white-600 to-indigo-600 rounded-xl flex items-center justify-center animate-glow">
                  <span className="text-white font-bold"><img src={logo} alt="Logo" className="w-15 h-15" /></span>
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900">QuickFixHub</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-glow">
              <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="animate-slide-in-left" style={{ animationDelay: '1.2s' }}>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="animate-slide-in-left" style={{ animationDelay: '1.5s' }}>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between animate-slide-in-left" style={{ animationDelay: '1.8s' }}>
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in-up" style={{ animationDelay: '2.1s' }}>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: '2.4s' }}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '2.7s' }}>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md animate-slide-in-left"
                      style={{ animationDelay: '3.0s' }}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                </div>

                <div className="text-center animate-fade-in-up" style={{ animationDelay: '3.3s' }}>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                      Sign up here
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '3.6s' }}>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center animate-slide-in-left" style={{ animationDelay: '3.9s' }}>
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Platform
                </div>
                <div className="flex items-center animate-slide-in-left" style={{ animationDelay: '4.2s' }}>
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Providers
                </div>
                <div className="flex items-center animate-slide-in-left" style={{ animationDelay: '4.5s' }}>
                  <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Trusted by 10k+ Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container"
      />
    </div>
  );
};

export default Login;