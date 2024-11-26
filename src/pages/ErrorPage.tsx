import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600">
                The page you're looking for does not exist.
            </p>
            <button
                onClick={goBack}
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
                Go Back
            </button>
        </div>
    );
};
