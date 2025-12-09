import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserData } from '../Store/Slices/UserSlice';
import { useAuth } from '../Utils/AuthContext';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JoinMeeting() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLogin } = useAuth();
  const userData = useSelector((state) => state.user.data);
  const [isLoading, setIsLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef(null);
  const joinUrl = location.state?.url || location.state?.data?.url;

  useEffect(() => {
    if (!joinUrl) {
      navigate(-1);
      return;
    }

    const fetchMeetingContent = async () => {
      const token = userData?.token;
      if (!token) {
        toast.error("Authentication token not found");
        navigate(-1);
        return;
      }

      try {
        const response = await fetch(joinUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 410) {
            toast.error("Meeting link has expired");
          } else if (response.status === 401 || response.status === 403) {
            toast.error("Unauthorized access to meeting");
            dispatch(removeUserData());
            localStorage.removeItem('userSession');
            navigate("/");
            return;
          } else {
            toast.error(`Failed to load meeting (${response.status})`);
          }
          navigate(-1);
          return;
        }

        const html = await response.text();
        setHtmlContent(html);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching meeting content:", error);
        toast.error("Failed to load meeting. Please check your connection.");
        navigate(-1);
      }
    };

    fetchMeetingContent();
  }, [joinUrl, navigate, userData]);

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  }, [htmlContent]);

  const handleLogout = () => {
    dispatch(removeUserData());
    localStorage.removeItem('currentView');
    localStorage.removeItem('userSession');
    setIsLogin(false);
    navigate('/');
  };

  if (!joinUrl) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Logout Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Live Meeting</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meeting...</p>
          </div>
        </div>
      )}

      {/* Meeting iframe */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full absolute inset-0"
          allow="camera; microphone; fullscreen; display-capture"
          title="Meeting Room"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-presentation"
        />
      </div>
    </div>
  );
}
