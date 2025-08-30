import {useState, type FC } from "react";

interface User {
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

interface UserCardProps {
    user: User;
    isAdmin: boolean;
    onUpdate: (userId: string, data: { CL: number; SL: number; EL: number; ML: number }) => void;
}

const UserCard: FC<UserCardProps> = ({ user, isAdmin, onUpdate }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        CL: user.CL,
        SL: user.SL,
        EL: user.EL,
        ML: user.ML,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = () => {
        onUpdate(user.id, formData);
        setEditMode(false);
    };

    return (
        <div className=" mx-auto bg-white shadow-lg rounded-xl p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <span className="text-sm text-gray-500">{user.role}</span>
            </div>

            <div className="mb-3">
                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-600"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {(["CL", "SL", "EL", "ML"] as const).map((leave) => (
                    <div key={leave} className="flex flex-col">
                        <label className="text-gray-500 font-medium">{leave}</label>
                        <input
                            type="number"
                            name={leave}
                            value={formData[leave]}
                            onChange={handleChange}
                            disabled={!editMode || !isAdmin} // conditional disabling
                            className={`mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${!editMode || !isAdmin ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-2">
                {editMode ? (
                    <>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    isAdmin && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default UserCard;
