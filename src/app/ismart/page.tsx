"use client";

import { AlertDialouge } from "@/components/custom/alert-dialogue";
import Navbar from "@/components/custom/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddISmart } from "@/lib/be-ismart";
import { ISmart } from "@/types/type";
import React, { useState } from "react";

const ISmartPage = () => {
    const [dataAdd, setDataAdd] = useState<ISmart | null>(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const handleAddISmart = async (newData: ISmart) => {
        setLoading(true);
        try {
            const response = await AddISmart(newData);
            if (response.status === "Ok") {
                setMsg("Data saved successfully");
                setTimeout(() => setMsg(null), 1500);
                setDataAdd(null);
            } else {
                setMsg(response.message || "Error adding data");
            }
        } catch {
            setMsg("Error adding data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDataAdd((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    return (
        <div>
            <Navbar />
            {loading && <p className="text-center">Loading...</p>}
            <div className="flex items-center justify-center w-full min-h-[80svh]">
                <section className="flex justify-center items-center w-full max-w-4xl">
                    <Card className="flex m-3 p-4 max-w-4xl w-full bg-gray-50 shadow-lg  rounded-lg">
                        <h1 className="text-center font-bold text-2xl">Add I-Smart</h1>
                        <div className="grid md:grid-cols-2 gap-4">
                            <section>
                                <div>
                                    <label htmlFor="fiber_node" className="text-sm font-semibold">
                                        Fiber Node:
                                    </label>
                                    <Input
                                        type="text"
                                        id="fiber_node"
                                        placeholder="Fiber Node"
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="text-sm font-semibold">
                                        Address:
                                    </label>
                                    <Input
                                        type="text"
                                        id="address"
                                        placeholder="Address"
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </section>
                            <section>
                                <div>
                                    <label htmlFor="coordinate" className="text-sm font-semibold">
                                        Coordinate:
                                    </label>
                                    <Input
                                        type="text"
                                        id="coordinate"
                                        placeholder="Coordinate"
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="street" className="text-sm font-semibold">
                                        Street:
                                    </label>
                                    <Input
                                        type="text"
                                        id="street"
                                        placeholder="Street"
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </section>
                        </div>
                        <div className="flex flex-col w-full items-end gap-3 mt-4">
                            {msg && (
                                <div className="w-max bg-green-500 px-2 py-1 rounded-lg">
                                    <p className="text-white font-semibold">{msg}</p>
                                </div>
                            )}
                            <div className="flex space-x-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setDataAdd(null)}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-500 hover:bg-blue-700 cursor-pointer"
                                    onClick={() => {
                                        if (!dataAdd) {
                                            setMsg("Please fill in all fields");
                                            setTimeout(() => setMsg(null), 1000); // Hapus pesan setelah 1 detik
                                            return;
                                        }
                                        handleAddISmart(dataAdd);
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default ISmartPage;