import { useContext, useEffect, useState } from "react";
import UserCard from "../components/UserCard"
import MainContext from "../context/MainContext";

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
const Team = () => {
    const { getAllUsers , updateUserLeaves} = useContext(MainContext)
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);


    const handleUpdate = async (userId: string, data: { CL: number; SL: number; EL: number; ML: number }) => {
        const updatedUser = await updateUserLeaves(userId, data);
        setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    };

    return (
        <>{users.map((user) => (
            <UserCard key={user.id} user={user} isAdmin={true} onUpdate={handleUpdate} />
        ))}</>
    )
}

export default Team
