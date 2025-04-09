"use client";

import React, { useEffect, useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { GetAllUsers, UpdateUser, DeleteUser, AddUser, GetUserById, GetUserByName } from "@/lib/be-user-handler";
import { UserForm } from "@/components/custom/user-form";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/custom/navbar";

import { User } from "@/types/type";
import ProfileUser from "./fe-profile-user";
import { AlertDialouge, ConfirmDialog } from "@/components/custom/alert-dialogue";
import { FaPen } from "react-icons/fa";
import { FaMagnifyingGlass, FaRegTrashCan } from "react-icons/fa6";
import { debounce } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUserFormVisible, setIsUserFormVisible] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [IsConfirmVisible, setIsConfirmVisible] = useState(false)

    const [error, setError] = useState<string | null>(null);
    const [alertKey, setAlertKey] = useState(0)


    const showAlert = (msg: string) => {
        setAlertKey((p) => p + 1)
        setError(msg)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const result = await GetAllUsers();
            if (result.status === "Ok") {
                setUsers(result.data);
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (user: User) => {
        try {
            const result = await AddUser(user);
            if (result.status === "Ok") {
                setUsers((prevUsers) => [...prevUsers, result.data]);
            } else {
                setError(result.message || "Failed to add user!");
            }
        } catch (error) {
            showAlert("Error to add user");
        }
    };

    const handleViewUser = async (user: User) => {
        try {
            const result = await GetUserById(user.id!);
            if (result.status === "Ok") {
                setViewUser(user)
            }
        } catch (error) {
            showAlert("Error to view user");
        }

    };

    const handleEditUser = async (user: User) => {
        if (userToEdit) {
            try {
                const result = await UpdateUser(userToEdit.id!, user);
                if (result.status === "Ok") {
                    setUsers((prevUsers) =>
                        prevUsers.map((u) => (u.id === userToEdit.id ? { ...u, ...user } : u))
                    );
                }
            } catch (error) {
                showAlert("Error to edit user");
            }
        }
    };

    const handleSearch = async (q: string) => {
        const lq = q.toLowerCase()
        try {
            setLoading(true)
            const result = await GetUserByName(lq)
            if (result.status === "Ok") {
                setUsers(result.data)
                setError(null)
            } else {
                showAlert(result.message || "Failed to search user")
            }
            setLoading(false)
        } catch (error) {
            showAlert("Error to search user");
        }
    }

    const handleDeleteUser = async () => {
        if (userToDelete) {
            try {
                const result = await DeleteUser(userToDelete.id!);
                if (result.status === "Ok") {
                    window.location.reload()
                } else {
                    showAlert(`Failed to delete user: ${userToDelete.name}`)
                }
            } catch (error) {
                showAlert("Error to delete user");
            }
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setIsConfirmVisible(true)
    }
    const handleCacelDelete = () => {
        setIsConfirmVisible(false)
        setUserToDelete(null)
    }

    const debounceSearch = debounce(handleSearch, 2000);


    return (
        <main>
            <Navbar />
            {error && (<AlertDialouge key={alertKey} message={error} />)}
            {IsConfirmVisible && (
                <ConfirmDialog
                    message={`Are you sure you want to delete ${userToDelete?.name}`}
                    onConfirm={handleDeleteUser}
                    onCancel={handleCacelDelete}
                />
            )}
            <div className="p-4 md:mx-10 mb-24">
                <section>
                    <div className="mb-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 h-12"
                                onChange={(e) => {
                                    e.preventDefault()
                                    const value = e.target.value;
                                    debounceSearch(value);
                                }}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaMagnifyingGlass className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul className="space-y-2">
                            {isVisible && (
                                <ProfileUser user={viewUser!} onClose={() => setIsVisible(false)} />
                            )}
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        setIsVisible(true)
                                        handleViewUser(user)
                                    }}
                                    className="flex justify-between border p-2 rounded-lg shadow hover:bg-orange-200 hover:cursor-pointer"
                                >
                                    <div className="grid space-y-2">
                                        <div className="flex items-center">
                                            <h1 className="font-semibold text-gray-700 w-20">Name:</h1>
                                            <p className="text-gray-900">{user.name}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <h1 className="font-semibold text-gray-700 w-20">Call Sign:</h1>
                                            <p className="text-gray-500">{user.call_sign}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUserToEdit(user);
                                                setIsUserFormVisible(true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <FaPen className='w-5 h-full' />
                                        </Button>
                                        <div className="border-r w-3 h-full border-gray-400 mx-3"></div>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(user)
                                            }}
                                            className='group cursor-pointer hover:bg-red-500'

                                        >
                                            <FaRegTrashCan className='w-5 h-full text-red-500 group-hover:text-white' />

                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section>
                    <div className="fixed bottom-5 right-5 z-50">
                        <div
                            className="group cursor-pointer bg-blue-500 text-white p-2 md:p-4 shadow-lg shadow-black rounded-full hover:bg-blue-600"
                            onClick={() => {
                                setUserToEdit(null);
                                setIsUserFormVisible(true);
                            }}
                        >
                            <HiUserAdd className="w-8 md:w-12 h-max" />
                        </div>
                    </div>
                    {isUserFormVisible && (
                        <UserForm
                            onClose={() => setIsUserFormVisible(false)}
                            onSubmit={userToEdit ? handleEditUser : handleAddUser}
                            user={userToEdit || undefined}
                        />
                    )}
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;