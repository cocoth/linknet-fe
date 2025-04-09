import { Card } from '@/components/ui/card';
import { User } from '@/types/type';
import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ProfileUser = ({ user, onClose }: { user: User, onClose: () => void }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    return (
        <div
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        >
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>
            <Card
                className="relative bg-gray-50 shadow-lg rounded-lg w-full max-w-md z-50 p-6"
            >

                <h2 className="text-lg font-bold mb-4 text-center">User Profile</h2>
                <section className="flex flex-col mb-4">

                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Name:</p>
                        <p className="text-gray-600">{user?.name || '-'}</p>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Email:</p>
                        <p className="text-gray-600">{user?.email || '-'}</p>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Phone:</p>
                        <p className="text-gray-600">{user?.phone || '-'}</p>
                    </div>
                    <div className="mb-4 flex items-center justify-between w-full border p-2 rounded-md">
                        <div className="flex space-x-3 ">
                            <p className="font-bold text-gray-700">Password:</p>
                            <p className="text-gray-600">
                                {showPassword ? user?.password || '-' : '••••••••'}
                            </p>
                        </div>
                        <button
                            onClick={togglePasswordVisibility}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaRegEyeSlash className="w-5 h-5 cursor-pointer" /> : <FaRegEye className="w-5 h-5 cursor-pointer" />}
                        </button>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Call Sign:</p>
                        <p className="text-gray-600">{user?.call_sign || '-'}</p>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Contractor:</p>
                        <p className="text-gray-600">{user?.contractor || '-'}</p>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Status:</p>
                        <p className="text-gray-600">{user?.status || '-'}</p>
                    </div>
                    <div className="flex space-x-3 border p-2 rounded-md mb-4">
                        <p className="font-bold text-gray-700">Role:</p>
                        <p className="text-gray-600">{user?.role?.name || '-'}</p>
                    </div>
                </section>

            </Card>

        </div>
    );
};

export default ProfileUser;