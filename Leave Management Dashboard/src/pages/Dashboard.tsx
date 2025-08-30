import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";

export default function Dashboard() {
    const Navigate = useNavigate()
    const { fetchUser, getLeaves, leaves } = useContext(MainContext);
    const [userData, setUserData] = useState<any>({
        CL: 0,
        EL: 0,
        ML: 0,
        SL: 0,
        email: "",
        name: ""
    });
    useEffect(() => {
        const Token = localStorage.getItem("token");
        if (!Token) {
            Navigate("/");
        }
        fetchUser().then((data: any) => {
            if (data) {
                setUserData(data);
            }
        });
        getLeaves()
    }, [])

    const handleLeaveType = (type) => {
        if (type === "CL") {
            return "Casual Leave"
        }
        else if (type === "SL") {
            return "Sick Leave"
        }
        else if (type === "EL") {
            return "Earned Leave"
        }
        else if (type === "ML") {
            return "Maternity Leave"
        }
    }


    return (
        <main className="p-4 max-w-full overflow-hidden">
            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-white flex flex-row items-center justify-between p-3 rounded-xl shadow-md min-w-0">
                    <h2 className="text-gray-600 text-sm sm:text-lg font-semibold">CL</h2>
                    <p className="text-lg sm:text-2xl font-bold text-gray-600">{userData.CL}</p>
                </div>
                <div className="bg-white flex flex-row items-center justify-between p-3 rounded-xl shadow-md min-w-0">
                    <h2 className="text-gray-600 text-sm sm:text-lg font-semibold">SL</h2>
                    <p className="text-lg sm:text-2xl font-bold text-gray-500">{userData.SL}</p>
                </div>
                <div className="bg-white flex flex-row items-center justify-between p-3 rounded-xl shadow-md min-w-0">
                    <h2 className="text-gray-600 text-sm sm:text-lg font-semibold">EL</h2>
                    <p className="text-lg sm:text-2xl font-bold text-gray-500">{userData.EL}</p>
                </div>
                <div className="bg-white flex flex-row items-center justify-between p-3 rounded-xl shadow-md min-w-0">
                    <h2 className="text-gray-600 text-sm sm:text-lg font-semibold">ML</h2>
                    <p className="text-lg sm:text-2xl font-bold text-gray-500">{userData.ML}</p>
                </div>
            </div>

            {/* Recent Leave Requests */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                    Recent Leave Requests
                </h2>

                {/* Mobile Card Layout */}
                <div className="block sm:hidden space-y-3">
                    {leaves.map((leave:any, index:number) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-4 ${leave.status === "Approved"
                                ? "bg-green-50 border-green-200"
                                : leave.status === "Pending"
                                    ? "bg-orange-50 border-orange-200"
                                    : "bg-red-50 border-red-200"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">{handleLeaveType(leave.Type)}</h3>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${leave.status === "Approved"
                                        ? "text-green-600 bg-green-100"
                                        : leave.status === "Pending"
                                            ? "text-orange-600 bg-orange-100"
                                            : "text-red-600 bg-red-100"
                                        }`}
                                >
                                    {leave.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    <span className="font-medium">Applied:</span> {new Date(leave.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">From:</span> {new Date(leave.startDate).toLocaleDateString()}
                                </div>
                                <div className="col-span-2">
                                    <span className="font-medium">To:</span> {new Date(leave.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse text-sm min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                                    <th className="p-3 font-semibold text-gray-700">Type</th>
                                    <th className="p-3 font-semibold text-gray-700">Applied Date</th>
                                    <th className="p-3 font-semibold text-gray-700">Start Date</th>
                                    <th className="p-3 font-semibold text-gray-700">End Date</th>
                                    <th className="p-3 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave: any, index: number) => (
                                    <tr
                                        key={index}
                                        className={`border-t border-gray-200 hover:bg-gray-50 ${leave.status === "Approved"
                                            ? "bg-green-50"
                                            : leave.status === "Pending"
                                                ? "bg-orange-50"
                                                : "bg-red-50"
                                            }`}
                                    >
                                        <td className="p-3 font-medium text-gray-900">{handleLeaveType(leave.Type)}</td>
                                        <td className="p-3 text-gray-600">{new Date(leave.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-600">{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-600">{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${leave.status === "Approved"
                                                    ? "text-green-600 bg-green-100"
                                                    : leave.status === "Pending"
                                                        ? "text-orange-600 bg-orange-100"
                                                        : "text-red-600 bg-red-100"
                                                    }`}
                                            >
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}