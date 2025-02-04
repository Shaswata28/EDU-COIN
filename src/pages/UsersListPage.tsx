import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { getAllUsers, searchUser, deleteUser } from "../services/admin";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    isActive: boolean;
    balance: number;
}

export const UsersListPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchId, setSearchId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch {
            setError("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchId.trim()) {
            await fetchUsers();
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const data = await searchUser(searchId);
            setUsers([data.user]);
        } catch {
            setError("User not found");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (
            window.confirm(
                "Are you sure you want to delete this user? This action cannot be undone."
            )
        ) {
            try {
                await deleteUser(userId);
                await fetchUsers();
            } catch {
                setError("Failed to delete user");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col">

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by Student ID or Email"
                                    value={searchId}
                                    onChange={(e) => {
                                        setSearchId(e.target.value);
                                        setError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    error={error}
                                    className="text-lg"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8"
                            >
                                <Search className="h-5 w-5" />
                                Search
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Balance
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center"
                                            >
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50] mx-auto"></div>
                                            </td>
                                        </tr>
                                    ) : users.length > 0 ? (
                                        users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.studentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    à§³{user.balance.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                                user.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                                                    >
                                                        {user.isActive ? (
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                        )}
                                                        {user.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                (window.location.href = `/admin/users/${user.studentId}`)
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
