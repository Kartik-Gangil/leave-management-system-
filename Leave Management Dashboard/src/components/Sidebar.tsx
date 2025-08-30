import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainContext from "../context/MainContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LinkItem {
    Link: string;
    endpoint: string;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const Navigate = useNavigate()
    const { name, Email, role, fetchUser } = useContext(MainContext)
    const links: LinkItem[] = [
        { Link: "Dashboard", endpoint: "/dashboard" },
        { Link: "Apply Leave", endpoint: "/createleave" },

    ];
    useEffect(() => {
        fetchUser()
    }, [])

    const handleLogOut = () => {
        localStorage.removeItem("token")
        Navigate("/")
        window.location.reload()
    }


    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-50 top-0 left-0 min-h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
            >
                <div className="text-2xl font-bold text-orange-500 p-6 flex justify-between items-center md:block">
                    LMS
                    <button className="md:hidden text-gray-500" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <nav className="space-y-2 p-6 md:p-2">
                    <h2 className="px-4">Welcome, {name} {role === "ADMIN" ? role : ""} </h2>
                    <h2 className="px-4">{Email}</h2>
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            to={link.endpoint}
                            className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-lg"
                            onClick={onClose}
                        >
                            {link.Link}
                        </Link>
                    ))}
                    {role.toUpperCase() == "ADMIN" && <Link to="/leaveRequests" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-lg">Leave Request</Link>}
                    {role.toUpperCase() == "ADMIN" && <Link to="/team" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-lg">Team</Link>}

                    <hr className="text-gray-200" />
                    {/* invitation creation button */}
                    {role.toUpperCase() == "ADMIN" && <Link to="/send-invite" className="block px-4 py-2 text-white bg-orange-400 hover:bg-orange-500 rounded-lg">Send Invite</Link>}
                    {/* logout button */}
                    {localStorage.getItem("token") && <button onClick={handleLogOut} className="block px-4 py-2 text-white bg-orange-400 hover:bg-orange-500 rounded-lg">Logout</button>}

                </nav>
            </aside>
        </>
    );
}
