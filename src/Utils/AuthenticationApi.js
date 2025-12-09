// Authentication API functions
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

 export const loginUser = async (email, password,captchaValue) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/live-lecture/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password.trim(),
            captchaValue,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

export const googleLoginUser = async (credential) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/live-lecture/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    });
    
    const data = await response.json();
    console.log('Google API Response:', data);
    
    // Return the data regardless of response.ok so we can show the actual error message
    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};


export const loginAdmin = async (email, password,captchaValue) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL_OLD}api/v1/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password.trim(),
            captchaValue,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };


export const logout = async (uid,lastLectureId,) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/live-lecture/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, lecture_id:lastLectureId, }),
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
