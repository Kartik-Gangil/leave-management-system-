import { useContext, useState } from "react";
import MainContext from "../context/MainContext";


export default function SendInvite() {
    const [email, setEmail] = useState("");
    // const [loading, setLoading] = useState(false);
    const { createInvite, response } = useContext(MainContext)
    const handleSendInvite = async () => {
        if (!email) return alert("Please enter an email");
        await createInvite({ email })
        

    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">Send Invite</h2>

            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleSendInvite}
                className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
                Create Invite
            </button>

            {response && (
                <p className={`mt-3 text-sm ${response.success ? "text-green-600" : "text-red-600"}`}>
                    {response.message}
                </p>
            )}
        </div>
    );
}
