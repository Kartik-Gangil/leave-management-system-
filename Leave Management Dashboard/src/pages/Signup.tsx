import React, { useContext, useEffect, useState } from "react";
import MainContext from "../context/MainContext";
import { useNavigate, useParams } from "react-router-dom";
export default function Signup() {
    const { Signup, auth } = useContext(MainContext);
    const Navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [Cpassword, setCPassword] = useState<string>("");
    const { inviteToken } = useParams();
    console.log(inviteToken)

    useEffect(() => {
        const Token = localStorage.getItem("token");
        if (Token) {
            Navigate("/dashboard");
        }
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await Signup({ email, password, Cpassword, name, inviteToken });
            
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
                    SignUp
                </h2>

                <form className="space-y-4" onSubmit={handleAuth}>

                    <input
                        onChange={(e) => { setName(e.target.value) }}
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

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


                    <input
                        onChange={(e) => { setCPassword(e.target.value) }}
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />


                    <button

                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-orange-600 transition"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?
                    <button
                        onClick={() => Navigate("/")}
                        className="text-orange-500 font-medium
                        cursor-pointer hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
