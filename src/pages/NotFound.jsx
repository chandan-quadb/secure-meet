import { useNavigate } from "react-router-dom"

export default function NotFound(){
    const navigate = useNavigate()
    
    const handleback = () => {
        navigate("/")
    }
    
    return(
        <>
         <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Direct access to meeting links is not permitted. Please login through the platform and find your meeting through the proper course selection process.
            </p>
            <button
              onClick={handleback}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
        </>
    )
}