import { useEffect, useRef } from "react";

const CustomGoogleButton = ({ onSuccess, onError, disabled }) => {
  const googleSignInButton = useRef(null);
  const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const handleCredentialResponse = (response) => {
      if (response.credential) {
        onSuccess(response);
      } else {
        onError(new Error("Google sign-in was canceled"));
      }
    };

    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      // ✅ Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        ux_mode: "popup",
        auto_select: false,
      });

      // ✅ Render the real (hidden) Google button inside our ref
      if (googleSignInButton.current) {
        window.google.accounts.id.renderButton(googleSignInButton.current, {
          theme: "outline",
          size: "large",
        });
      }
    };

    // ✅ Load Google script only once
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, [googleClientId, onSuccess, onError]);

  const handleCustomButtonClick = () => {
    if (!disabled && googleSignInButton.current) {
      // Simulate click on hidden Google button
      googleSignInButton.current.querySelector("div[role=button]")?.click();
    }
  };

  return (
    <>
      {/* Visible custom button */}
      <button
        onClick={handleCustomButtonClick}
        disabled={disabled}
        type="button"
        className={`
          w-full flex cursor-pointer mt-12 md:mt-16 items-center justify-center
          bg-black text-black border border-gray-300
           shadow-sm
          px-4 py-2 md:px-6 md:py-3
          text-base font-medium
          transition-all duration-200
          hover:shadow-md hover:border-gray-600
          active:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
      >
        <div className="mr-3">
          {/* Google Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
              1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
              3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 
              7.28-2.66l-3.57-2.77c-.98.66-2.23 
              1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
              20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
              8.55 1 10.22 1 12s.43 3.45 
              1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 
              4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 
              12 1 7.7 1 3.99 3.47 2.18 
              7.07l3.66 2.84c.87-2.6 3.3-4.53 
              6.16-4.53z"
            />
          </svg>
        </div>
        <span className="whitespace-nowrap text-white">Continue with Google</span>
      </button>

      {/* Hidden Google Button */}
      <div ref={googleSignInButton} style={{ display: "none" }} />
    </>
  );
};

export default CustomGoogleButton;
