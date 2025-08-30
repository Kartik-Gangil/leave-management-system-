import { useContext, useEffect, useState } from "react";
import MainContext from "../context/MainContext";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const { Login } = useContext(MainContext);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const Navigate = useNavigate();

    useEffect(() => {
        const Token = localStorage.getItem("token");
        if (Token) {
            Navigate("/dashboard");
        }
    }, [])
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await Login({ email, password });
            
            if (res) {
                Navigate("/dashboard");
            }

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h2>

                <form className="space-y-4" onSubmit={handleAuth}>

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <button

                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-orange-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-pretty text-gray-600 mt-4">
                    Don't have an account? Reach out to admin to get the invite link
                </p>
            </div>
        </div>
    )
}

export default Login
