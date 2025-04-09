"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { User } from "@/types/type";
import { GetAllRole, GetUserByCallSign } from "@/lib/be-user-handler";

interface UserFormProps {
    onClose: () => void;
    onSubmit: (user: User) => void;
    user?: User
}

export const UserForm = ({ onClose, onSubmit, user }: UserFormProps) => {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [password, setPassword] = useState(user?.password || "");
    const [callSign, setCallSign] = useState(user?.call_sign || "");
    const [contractor, setContractor] = useState(user?.contractor || "");
    const [role, setRole] = useState(user?.role?.name || "");
    const [roles, setRoles] = useState<string[]>([]);
    

    const handleSubmit = () => {
        if (!name || !email || !phone || !password || !callSign || !role ) {
            alert("All fields are required.");
            return;
        }
        onSubmit({
            name,
            email,
            phone,
            password,
            call_sign: callSign,
            contractor: contractor,
            role: { name: role }
        });
        onClose();
    };

    useEffect(() => {
        const fetchRoles = async () => {
            const result = await GetAllRole();
            if (result.status === "Ok") {
                setRoles(result.data.map((role: { name: string }) => role.name)); // Ambil nama role
            }
        };

        fetchRoles();
    }, []);

    return (
        <div>
            {/* Overlay */}
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onClick={onClose}
                className="fixed top-0 left-0 w-full h-full z-[999]"
            ></div>

            {/* Form */}
            <div
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                className="absolute md:fixed top-[50%] left-[50%] transform -translate-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 z-[1000] bg-white rounded-lg shadow-lg"
            >
                <h2 className="text-lg text-center font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>
                <section className="flex flex-col space-y-2">

                <div>
                    <p className="font-bold text-gray-black">Name:</p>
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                <div>
                    <p className="font-bold text-gray-black">Email:</p>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                <div>
                    <p className="font-bold text-gray-black">Phone:</p>
                    <Input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                <div>
                    <p className="font-bold text-gray-black">Password:</p>
                    <Input
                        type="password"
                        placeholder="Password at least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                    {password && password.length  < 8 && (
                        <p className="text-red-500 text-sm mt-1">
                            Password must be at least 8 characters long.
                        </p>
                    )}
                </div>
                <div>
                    <p className="font-bold text-gray-black">Call Sign:</p>
                    <Input
                        type="text"
                        placeholder="Call Sign"
                        value={callSign}
                        onChange={(e) => setCallSign(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                <div>
                    <p className="font-bold text-gray-black">Contractor:</p>
                    <Input
                        type="text"
                        placeholder="Contractor"
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>
                </section>

                <div>
                    <p className="font-bold text-gray-black">Role:</p>
                    <Select
                        onValueChange={(value) => setRole(value)}
                        value={role}
                    >
                        <SelectTrigger className="w-full border p-2 rounded cursor-pointer">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000] cursor-pointer">
                            {roles.map((roleName) => (
                                <SelectItem key={roleName} value={roleName} className="cursor-pointer">
                                    {roleName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-around mt-4">
                    <Button variant="ghost" onClick={onClose} className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleSubmit} className="cursor-pointer bg-blue-500">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};