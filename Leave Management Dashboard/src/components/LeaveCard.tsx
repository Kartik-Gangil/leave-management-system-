import axios from "axios";
import type { AxiosResponse } from "axios";
import { useContext } from "react";
import MainContext from "../context/MainContext";


interface LeaveCardProps {
    id: string
    name: string,
    email: string,
    role: string,
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: string;
    Type: string;
    status: string;
    createdAt: string;
    documentUrl?: string;
}

export default function LeaveCard({
    id,
    name,
    email,
    role,
    startDate,
    endDate,
    reason,
    totalDays,
    Type,
    status,
    createdAt,
    documentUrl,
}: LeaveCardProps) {
    const { getAllLeaves } = useContext(MainContext);

    const handleDownload = async (id: string): Promise<void> => {
        try {
            const response: AxiosResponse<Blob> = await axios.get(
                `http://localhost:8000/api/download/${id}`,
                {
                    responseType: "blob", // important for binary files
                }
            );

            // Get filename from headers
            const disposition = response.headers["content-disposition"];
            let filename = "downloaded-file";

            if (disposition && disposition.includes("filename=")) {
                filename = disposition.split("filename=")[1].replace(/['"]/g, "");
            }

            // Create a URL for the file blob
            const url = window.URL.createObjectURL(response.data);

            // Create link to download
            const link = document.createElement("a");
            link.href = url;
            link.download = filename; // ✅ keeps original extension
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Free memory
            window.URL.revokeObjectURL(url);

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Download failed:", error.response?.data || error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };


    const handleApproveorReject = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`http://localhost:8000/api/update-leave/${id}/${status}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        } finally {
            getAllLeaves()
        }
    }



    return (
        <div className=" mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Request</h2>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
            ${status === "Approved" ? "bg-green-100 text-green-800"
                            : status === "Rejected" ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"}`}
                >
                    {status}
                </span>
            </div>

            {/* Body */}
            <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">

                <div className="flex gap-3 flex-col md:flex-row">
                    <p><span className="font-semibold">Name:</span> {name} </p>
                    <p><span className="font-semibold">Email:</span> {email}</p>
                    <p><span className="font-semibold">Role:</span> {role} </p>
                </div>
                <p><span className="font-semibold">Start Date:</span> {new Date(startDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">End Date:</span> {new Date(endDate).toLocaleDateString()}</p>
                <p><span className="font-semibold">Reason:</span> {reason}</p>
                <p><span className="font-semibold">Total Days:</span> {totalDays}</p>
                <p><span className="font-semibold">Type:</span> {Type}</p>
                <p><span className="font-semibold">Requested On:</span> {new Date(createdAt).toLocaleDateString()}</p>
                {documentUrl && (
                    <p>
                        <span className="font-semibold">Document:</span>{" "}
                        <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                        >
                            View Document
                        </a>
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
                <button
                    onClick={() => handleDownload(id)}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Document ↓
                </button>
                <button
                    onClick={() => handleApproveorReject(id, "APPROVED")}
                    className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Approve
                </button>
                <button
                    onClick={() => handleApproveorReject(id, "REJECT")}
                    className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
