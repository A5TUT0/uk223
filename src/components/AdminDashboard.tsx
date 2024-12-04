'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LeftSidebar } from './LeftSidebar';
const API_URL = process.env.VITE_API_URL || 3000;

interface User {
    id: number;
    username: string;
    email: string;
    status: boolean;
    is_blocked: boolean;
    role: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            console.error('[FETCH USERS] Error:', err);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const toggleBlockUser = async (userId: number, isBlocked: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/users/block`,
                { userId, isBlocked },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, is_blocked: isBlocked } : user
                )
            );
        } catch (err) {
            console.error('[BLOCK USER] Error:', err);
            setError('Failed to update user status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen  text-[#FFFFFF]">
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen  text-[#FFFFFF]">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen  text-[#FFFFFF]">
            <div className="w-64 border-r border-[#4B5563]">
                <LeftSidebar />
            </div>

            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Admin Dashboard</h1>

                <div className="overflow-x-auto rounded-lg border border-[#4B5563]">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-[#000000] border-b border-[#4B5563]">
                                <th className="p-3 text-left font-semibold">ID</th>
                                <th className="p-3 text-left font-semibold">Username</th>
                                <th className="p-3 text-left font-semibold">Email</th>
                                <th className="p-3 text-left font-semibold">Role</th>
                                <th className="p-3 text-left font-semibold">Status</th>
                                <th className="p-3 text-left font-semibold">Blocked</th>
                                <th className="p-3 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="odd:bg-[#000000] even:bg-[#09090B] border-b border-[#4B5563] hover:bg-[#1A1A1D]"
                                >
                                    <td className="p-3">{user.id}</td>
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">{user.status ? 'Active' : 'Inactive'}</td>
                                    <td className="p-3">{user.is_blocked ? 'Yes' : 'No'}</td>
                                    <td className="p-3">
                                        <button
                                            className={`px-4 py-2 rounded font-medium ${user.is_blocked
                                                ? 'bg-green-500 hover:bg-green-400'
                                                : 'bg-red-500 hover:bg-red-400'
                                                }`}
                                            onClick={() => toggleBlockUser(user.id, !user.is_blocked)}
                                        >
                                            {user.is_blocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
