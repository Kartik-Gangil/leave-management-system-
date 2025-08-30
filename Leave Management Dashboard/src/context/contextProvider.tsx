import { useState, type ReactNode } from "react";
import MainContext from "./MainContext";
import axios from "axios";

const host = "http://localhost:8000/api"

interface ContextProviderProps {
    children: ReactNode;
}
interface LoginProps {
    email: string;
    password: string;
}
interface SignUPProps {
    email: string;
    password: string;
    name: string;
    Cpassword: string;
    inviteToken: string;
}
interface InviteResponse {
    success: boolean;
    message: string;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    CL: number;
    SL: number;
    EL: number;
    ML: number;
    createdAt: string;
    updatedAt: string;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
    const [auth, setIsAuth] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [Email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [response, setResponse] = useState<InviteResponse | null>(null);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [ALLleaves, setAllLeaves] = useState<any[]>([]);
    const Login = async ({ email, password }: LoginProps) => {

        try {
            const res = await axios.post(`${host}/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            setIsAuth(true);
            return res.data; // return for caller if needed
        } catch (err) {
            console.error(err);
            setIsAuth(false);
            throw err;
        }
    }

    const Signup = async ({ email, password, name, Cpassword, inviteToken }: SignUPProps) => {
        if (password !== Cpassword || password.length < 6) {
            alert("Passwords do not match or are less than 6 characters");
            return;
        }
        if (!inviteToken || inviteToken.length === 0) {
            alert("you are not authorised to signup");
            return;
        }

        try {
            const res = await axios.post(`${host}/signup`, {
                inviteToken: inviteToken,
                email,
                password,
                name,
            });
            localStorage.setItem("token", res.data.token);
            setIsAuth(true);
            return res.data;
        } catch (err) {
            console.error(err);
            setIsAuth(false);
            throw err;
        }
    }

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuth(false);
                return null;
            }

            const res = await axios.get(`${host}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setName(res.data.name)
            setEmail(res.data.email)
            setRole(res.data.role)
            // console.log(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
            setIsAuth(false);
            return null;
        }
    }
    // invite creation function
    const createInvite = async ({ email }: { email: string }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${host}/send-invite`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setResponse({ success: true, message: res.data.inviteLink || "Invite sent!" });
        } catch (err: any) {
            setResponse({ success: false, message: err.response?.data?.message || "Something went wrong" });
        }
    }
    // get leaves on basis of the userID

    const getLeaves = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(`${host}/getLeaves`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // setResponse({ success: true, message: res.data.inviteLink || "Invite sent!" });
            setLeaves(res.data);
        } catch (err: any) {
            setResponse({ success: false, message: err.response?.data?.message || "Something went wrong" });
        }
    }
    const getAllLeaves = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(`${host}/getAllLeaves`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // setResponse({ success: true, message: res.data.inviteLink || "Invite sent!" });
            setAllLeaves(res.data);
            console.log(res.data)
        } catch (err: any) {
            setResponse({ success: false, message: err.response?.data?.message || "Something went wrong" });
        }
    }

    const getAllUsers = async (): Promise<User[]> => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${host}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.users;
        } catch (error: any) {
            console.error("Error fetching users:", error.response?.data || error.message);
            throw error;
        }
    };

    const updateUserLeaves = async (
        userId: string,
        data: { CL?: number; SL?: number; EL?: number; ML?: number },
    ): Promise<User> => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.put(`${host}/update-leaves/${userId}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.user;
        } catch (error: any) {
            console.error("Error updating leaves:", error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <MainContext.Provider value={{
            updateUserLeaves , getAllUsers ,Login, Signup, auth, fetchUser, name, createInvite, response, Email, role, getLeaves, leaves, ALLleaves, getAllLeaves
        }}>
            {children}
        </MainContext.Provider>
    );
};

export default ContextProvider;