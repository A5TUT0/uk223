import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Alert from './alert';
import { LeftSidebar } from './LeftSidebar';

const Settings: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
    // const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const API_URL = process.env.VITE_API_URL || "http://backend:3000";

    const handleSaveUsername = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized. Token missing.');
            }

            const response = await axios.post(
                `${API_URL}/change-username`,
                { newUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newToken = response.data.token;
            if (newToken) {
                localStorage.setItem('token', newToken);
            }

            setAlertType('success');
            setAlertMessage(response.data.message || 'Username updated successfully!');
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error.response?.data?.message || 'Error updating username.');
        } finally {
            setShowAlert(true);
        }
    };




    const handleSavePassword = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized. Token missing.');
            }

            const response = await axios.post(
                `${API_URL}/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAlertType('success');
            setAlertMessage(response.data.message || 'Password updated successfully!');
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error.response?.data?.message || 'Error updating password.');
        } finally {
            setShowAlert(true);
        }
    };





    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized. Token missing.');
            }

            const response = await axios.post(
                `${API_URL}/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.removeItem('token');
            console.log('[LOGOUT] Token removed from localStorage.');

            setAlertType('success');
            setAlertMessage(response.data.message || 'Logged out successfully.');

            window.location.href = '/login';
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error.response?.data?.message || 'Error logging out.');
        } finally {
            setShowAlert(true);
        }
    };


    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized. Token missing.');
            }

            const response = await axios.delete(`${API_URL}/delete-account`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.removeItem('token');

            setAlertType('success');
            setAlertMessage(response.data.message || 'Account deleted successfully.');

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error.response?.data?.message || 'Error deleting account.');
        } finally {
            setShowAlert(true);
        }
    };



    return (
        <div className="flex h-screen">
            <LeftSidebar />

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 ml-64 p-8 space-y-6"
            >
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>

                {showAlert && (
                    <Alert
                        type={alertType}
                        message={alertMessage}
                        onClose={() => setShowAlert(false)}
                    />
                )}

                {/* Cambiar Nombre de Usuario */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Change Username</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="newUsername">New Username</Label>
                        <Input
                            id="newUsername"
                            placeholder="Enter your new username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveUsername} className="bg-blue-600 hover:bg-blue-500">
                            Save Username
                        </Button>
                    </CardFooter>
                </Card>

                {/* Cambiar Contraseña */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Label htmlFor="newPassword" className="mt-4">
                            New Password
                        </Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSavePassword} className="hover:bg-blue-500">
                            Save Password
                        </Button>
                    </CardFooter>
                </Card>

                {/* Cerrar Sesión */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Log Out</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-500">
                            Log Out
                        </Button>
                    </CardFooter>
                </Card>

                {/* Borrar Cuenta */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Delete Account</CardTitle>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-500">
                            Delete Account
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Settings;
