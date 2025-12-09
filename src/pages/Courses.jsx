
import { LogOut, Video, BookOpen, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { removeUserData } from '../Store/Slices/UserSlice';
import { useAuth } from '../Utils/AuthContext';
import noData from "../assets/no-data.png"
import { logout } from '../Utils/AuthenticationApi';
import { calcDuration, formatDateTime } from '../Utils/date';

export default function Courses() {
  const [userName, setUserName] = useState('User');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [meetingsList, setMeetingsList] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [joiningMeeting, setJoiningMeeting] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLogin } = useAuth();
  const userData = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const [coursesList, setCourseList] = useState([]);
  useEffect(() => {
    if (userData) {
      setUserName(userData.user_name || userData.user_username || 'User');
    }
  }, [userData]);

  useEffect(() => {
    setLoading(true)
    const fetchCourses = async () => {

      if (!userData?.user_mail) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}api/v1/course/purchased-courses?email=${userData.user_mail}`
        );


        const data = await response.json();

        if (!response.ok) {
          if (
            data?.message === "Token not found. Please login again." ||
            data?.message === "Invalid token or user not verified"
          ) {
            dispatch(removeUserData())
            navigate("/login");
          }
          toast.error(data?.message || "server error");
          return;
        }

        setCourseList(data?.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchCourses();
  }, [userData]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = userData?.token;
      if (!selectedCourse) {
        setMeetingsList([]);
        return;
      }

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      setLoadingMeetings(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}api/v1/live-lecture/lectures/course/${selectedCourse}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorisation': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();
        console.table("data data 94", data)
        if (!response.ok) {
          if (
            data?.message === "Token not found. Please login again." ||
            data?.message === "Invalid token or user not verified"
          ) {
            dispatch(removeUserData());
            localStorage.removeItem('userSession');
            navigate("/");
          }
          toast.error(data?.message || "Failed to fetch meetings");
          setMeetingsList([]);
          return;
        }

        setMeetingsList(data?.data || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Failed to load meetings");
        setMeetingsList([]);
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, [selectedCourse, userData, dispatch, navigate]);


  const handleJoinMeeting = async (lectureId) => {
    const token = userData?.token;

    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    setJoiningMeeting(lectureId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}api/v1/live-lecture/lectures/${lectureId}/join`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorisation': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data?.message === "Token not found. Please login again." ||
          data?.message === "Invalid token or user not verified"
        ) {
          dispatch(removeUserData());
          localStorage.removeItem('userSession');
          navigate("/");
        }
        toast.error(data?.message || "Failed to join meeting");
        return;
      }

      const joinUrl = data?.url || data?.data?.url;

      if (!joinUrl) {
        toast.error("Meeting link not available");
        return;
      }
      localStorage.setItem("lastJoinedLecture", lectureId.toString());
      navigate('/join-meeting', { state: { url: joinUrl, data } });

      // toast.success("Joining meeting...");
      // window.location.href = joinUrl;

    } catch (error) {
      console.error("Error joining meeting:", error);
      toast.error("Failed to join meeting");
    } finally {
      setJoiningMeeting(null);
    }
  };

  const handleLogout = () => {
    const lastJoinedLecture = localStorage.getItem('lastJoinedLecture');

    logout(userData?.user_id, lastJoinedLecture);
    dispatch(removeUserData());
    localStorage.removeItem('currentView');
    localStorage.removeItem('userSession');
    setIsLogin(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {userName}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Course Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen className="text-indigo-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Select Course</h2>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 font-medium"
                    disabled={coursesList.length === 0}
                  >
                    <option value="">-- Choose a course --</option>
                    {coursesList.map(course => (
                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-indigo-700 font-medium">
                        {coursesList.length > 0
                          ? `${coursesList.length} purchased course${coursesList.length > 1 ? 's' : ''} available`
                          : 'No purchased courses found'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Content - Meetings List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Calendar className="text-indigo-600" size={28} />
                {selectedCourse ? 'Available Meetings' : 'Select a course to view meetings'}
              </h3>
              {selectedCourse && meetingsList.length > 0 && (
                <p className="text-gray-600 mt-2 text-sm">
                  Found {meetingsList.length} lecture{meetingsList.length > 1 ? 's' : ''} for this course
                </p>
              )}
            </div>

            {loadingMeetings ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading meetings...</p>
              </div>
            ) : !selectedCourse ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-gray-400" size={40} />
                </div>
                <p className="text-gray-600 text-lg">Please select a course from the dropdown to view available meetings.</p>
              </div>
            ) : meetingsList.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <img src={noData} alt='No meetings found' className="w-48 mx-auto mb-4 opacity-75" />
                <p className="text-gray-600 text-lg font-medium">No lectures found for this course.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {meetingsList.map((meeting, index) => (
                  <div
                    key={meeting.lecture_id || index}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                              <Video className="text-indigo-600" size={20} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {meeting.lecture_title || 'Untitled Meeting'}
                              </h3>
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                Lecture #{index + 1}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} className="text-indigo-500" />
                              <span className="font-medium">Start:</span>
                              <span>{formatDateTime(meeting.lecture_start_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} className="text-red-500" />
                              <span className="font-medium">End:</span>
                              <span>{formatDateTime(meeting.lecture_end_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} className="text-green-500" />
                              <span className="font-medium">Duration:</span>
                              <span>{calcDuration(meeting.lecture_start_time, meeting.lecture_end_time)}</span>
                            </div>
                            {meeting.lecture_passcode && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <span className="text-amber-500">🔒</span>
                                </div>
                                <span className="font-medium">Passcode:</span>
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{meeting.lecture_passcode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinMeeting(meeting.lecture_id)}
                        disabled={joiningMeeting === meeting.lecture_id}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                      >
                        {joiningMeeting === meeting.lecture_id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <Video size={20} />
                            <span>Join Meeting</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
