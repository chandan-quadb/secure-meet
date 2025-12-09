import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { AES, enc } from 'crypto-js';
import CustomGoogleButton from '../Utils/CustomGoogleButton';
import { loginUser } from '../Utils/AuthenticationApi';
import { addUserData } from '../Store/Slices/UserSlice';
import { useAuth } from '../Utils/AuthContext';
import { GoogleLogin } from '../Utils/GoogleLogin';

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLogin } = useAuth();
  const siteKey = import.meta.env.VITE_APP_SITE_KEY;

  useEffect(() => {
    const loadReCaptcha = () => {
      if (!window.grecaptcha) {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadReCaptcha();

    return () => {
      const script = document.getElementById("recaptcha-script");
      if (script) {
        document.body.removeChild(script);
      }

      // Remove any reCAPTCHA badges
      const badges = document.querySelectorAll(".grecaptcha-badge");
      badges.forEach((badge) => {
        if (badge.parentNode) {
          badge.parentNode.removeChild(badge);
        }
      });

      // Reset grecaptcha if it exists
      if (window.grecaptcha) {
        delete window.grecaptcha;
      }
    };
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    setIsLogin(false);
    
    try {
      // Wait for grecaptcha to be ready
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        toast.error('reCAPTCHA not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Get reCAPTCHA v3 token
        const captchaValue = await window?.grecaptcha.execute(siteKey, {
          action: "login",
        });

      if (!captchaValue) {
        toast.error('Failed to get reCAPTCHA token. Please try again.');
        setLoading(false);
        return;
      }

      const data = await loginUser(email, password, captchaValue);
      
      if (data.status === 'Success') {
        toast.success('Login successful!');
        
        // Decrypt user data
        const userData = data?.data && AES.decrypt(data?.data, import.meta.env.VITE_APP_ENCRYPTION);
        const decryptedUserData = userData && JSON.parse(userData.toString(enc.Utf8));
        
        // Store session in sessionStorage
        localStorage.setItem('userSession', JSON.stringify({
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
          userEmail: decryptedUserData?.user_mail || email
        }));
        
        // Store encrypted data in Redux
        dispatch(addUserData(data.data));
        setIsLogin(true);
        
       
          navigate('/courses');
   
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> 
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
              Training Hub
            </h1>
            <p className="text-center text-gray-600 mb-8">Login to access your courses</p>

            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login with Email'}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

           <CustomGoogleButton
              onSuccess={(credentialResponse) =>
                GoogleLogin(
                  credentialResponse,
                  navigate,
                  setLoading,
                  setIsLogin,
                  dispatch
                )
              }
              onError={(error) => toast.error(error.message)}
              disabled={loading}
            />

          </div>
        </div>
    </div>
  );
}