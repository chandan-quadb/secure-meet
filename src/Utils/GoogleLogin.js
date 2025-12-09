import { googleLoginUser } from './AuthenticationApi';
import toast from 'react-hot-toast';
import { AES, enc } from 'crypto-js';

export const GoogleLogin = async (
  credentialResponse,
  navigate,
  setDisableButton,
  setIsLogin,
  dispatch
) => {
  setDisableButton(true);
  
  try {
    const data = await googleLoginUser(credentialResponse.credential);
    
    console.log('Google login response:', data);
    
    if (data.status === 'Success') {
      toast.success('Login successful!');
      
      // Decrypt user data
      const userData = data?.data && AES.decrypt(data?.data, import.meta.env.VITE_APP_ENCRYPTION);
      const decryptedUserData = userData && JSON.parse(userData.toString(enc.Utf8));
      
      // Store session in sessionStorage (not localStorage)
      localStorage.setItem('userSession', JSON.stringify({
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        userEmail: decryptedUserData?.user_mail || 'google_user'
      }));
      
      // Store encrypted data in Redux
      dispatch({ type: 'user/addUserData', payload: data.data });
      
      setIsLogin(true);
      
        navigate('/courses');
    } else {
      // Show the actual error message from the API
      toast.error(data.message || 'Google login failed');
    }
  } catch (error) {
    console.error('Google login error:', error);
    // Show the error message from the caught error
    toast.error(error.message || 'Failed to login with Google');
  } finally {
    setDisableButton(false);
  }
};
