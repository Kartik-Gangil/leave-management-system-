import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";

export default function LeaveForm() {

    const { fetchUser } = useContext(MainContext)
    const [userLeaves, setUserLeaves] = useState<any>({
        CL: 0,
        EL: 0,
        ML: 0,
        SL: 0,
    });
    const [totalDays, setTotalDays] = useState<number>(0)
    useEffect(() => {
        const Token = localStorage.getItem("token");
        if (!Token) {
            Navigate("/");
        }
        fetchUser().then((data: any) => {
            if (data) {
                setUserLeaves(data);
            }
        });
    }, [])



    const Navigate = useNavigate();
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        document: null,
    });

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const oneDay = 24 * 60 * 60 * 1000;
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            setTotalDays(Math.round((end.getTime() - start.getTime()) / oneDay) + 1);
        }
    }, [formData.startDate, formData.endDate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let updatedData;

        if (name === "document") {
            updatedData = { ...formData, document: files[0] };
        } else {
            updatedData = { ...formData, [name]: value };
        }
        setFormData(updatedData)

    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // create FormData if uploading a file
            const dataToSend = new FormData();
            (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
                // If the value is null, skip appending
                if (formData[key] !== null) {
                    dataToSend.append(key, formData[key] as string | Blob);
                }
            });

            // API call
            const res = await axios.post("http://localhost:8000/api/apply-leave", dataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
            });

            console.log("API Response:", res.data);
            alert("your quest sumbitted")
            Navigate('/dashboard')
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 ">
                        Submit Leave Request
                    </h2>
                    <button onClick={() => Navigate('/dashboard')} className="font-bold cursor-pointer">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    {/* Leave Type */}
                    <div>
                        <label className="block text-gray-700 mb-1">Leave Type</label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select Leave Type</option>
                            <option disabled={userLeaves.CL >= totalDays ? false : true} value="CL">Casual Leave (CL)</option>
                            <option disabled={userLeaves.SL >= totalDays ? false : true} value="SL">Sick Leave (SL)</option>
                            <option disabled={userLeaves.EL >= totalDays ? false : true} value="EL">Earned Leave (EL)</option>
                            <option disabled={userLeaves.ML >= totalDays ? false : true} value="ML">Maternity Leave (ML)</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-gray-700 mb-1">Reason</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter the reason for leave"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <h1>Total days :{totalDays}</h1>
                    {/* Document Upload */}
                    <div>
                        <label className="block text-gray-700 mb-1">Supporting Document</label>
                        <input
                            type="file"
                            name="document"
                            onChange={handleChange}
                            accept=".pdf,.jpg,.png"
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className=" cursor-pointer
                        w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
