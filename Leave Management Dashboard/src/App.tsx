import "./App.css";
import Auth from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LeaveForm from "./pages/LeaveForm";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import SendInvite from "./pages/SendInvite";
import LeaveRequest from "./pages/LeaveRequest";
import Team from "./pages/Team";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ">
          {/* Mobile Topbar */}
          <div className="md:hidden p-4 flex items-center justify-between bg-white shadow">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-orange-500 text-2xl font-bold"
            >
              ☰
            </button>
          </div>

          {/* Routes */}
          <div className="flex-1 py-4 px-2 md:p-6">
            <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/signup/:inviteToken" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/createleave" element={<LeaveForm />} />
              <Route path="/send-invite" element={<SendInvite />} />
              <Route path="/leaveRequests" element={<LeaveRequest />} />
              <Route path="/team" element={<Team />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
