"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Survey, User } from "@/types/type";
import { GetUserByCallSign, GetUserById } from "@/lib/be-user-handler";
import { debounce } from "@/lib/utils";
import { DownloadFile, GetFileByID, UploadFile } from "@/lib/be-file-handler";
import { AlertDialouge } from "./alert-dialogue";

interface SurveyFormProps {
    onClose: () => void;
    onSubmit: (data: Survey) => void;
    survey?: Survey;
}

const SurveyForm = ({ onClose, onSubmit, survey }: SurveyFormProps) => {
    const [formData, setFormData] = useState<Survey>({
        title: survey?.title || "",
        form_number: survey?.form_number || "",
        fat: survey?.fat || "",
        customer_name: survey?.customer_name || "",
        address: survey?.address || "",
        node_fdt: survey?.node_fdt || "",
        survey_date: survey?.survey_date ? new Date(survey.survey_date) : new Date(),
        questor_name: survey?.questor_name || "",
        surveyors: survey?.surveyors || [],
        image_id: survey?.image_id || "",
        CreatedAt: survey?.CreatedAt || new Date().toString(),
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<User | null>(null);
    const [callSigns, setCallSigns] = useState<string>(""); // To store call signs for surveyors

    const [searchInput, setSearchInput] = useState<string>(""); // State untuk input pencarian
    const [error, setError] = useState<string | null>(null)
    const [msg, setMsg] = useState<string | null>(null)
    const [alertKey, setAlertKey] = useState(0)

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const showAlert = (msg: string) => {
        setAlertKey((p) => p + 1)
        setError(msg)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            const uploadResponse = await UploadFile(selectedFile);
            if (uploadResponse.status === "Ok" && uploadResponse.data?.id) {
                const fileId = uploadResponse.data.id;
                const fileResponse = await GetFileByID(fileId);
                console.log(`File response:`, JSON.stringify(fileResponse));
                if (fileResponse.status === "Ok" && fileResponse.data[0]?.id) {
                    setFormData((prev) => ({
                        ...prev,
                        image_id: fileResponse.data[0].id, // Set image_id from response
                    }));
                } else {
                    showAlert(fileResponse.message || "Failed to get file ID.");
                }
            } else {
                showAlert("Failed to upload file.");
            }
        } catch (error) {
        } finally {
            setUploading(false);
        }
    };
    useEffect(() => {
        const fetchPreviewImage = async () => {
            if (formData.image_id) {
                const response = await DownloadFile(formData.image_id);
                if (response.success && response.data?.fileUrl) {
                    setPreviewUrl(response.data.fileUrl); // Set preview URL
                } else {
                    console.error("Failed to fetch preview image");
                }
            }
        };

        fetchPreviewImage();
    }, [formData.image_id]);

    // Fetch call signs for existing surveyors when editing
    useEffect(() => {
        const fetchCallSigns = async () => {
            if (formData.surveyors && formData.surveyors.length > 0) {
                const callSignPromises = formData.surveyors.map(async (surveyor) => {
                    if (surveyor.surveyor_id) {
                        const response = await GetUserById(surveyor.surveyor_id);
                        if (response.status === "Ok" && response.data[0]?.call_sign) {
                            return response.data[0].call_sign;
                        }
                    }
                    return "";
                });

                const fetchedCallSigns = await Promise.all(callSignPromises);
                setCallSigns(fetchedCallSigns.filter(Boolean).join(", ")); // Join array into a string
            }
        };

        fetchCallSigns();
    }, [formData.surveyors]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose(); // Call onClose when Esc is pressed
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown); // Cleanup listener on unmount
        };
    }, [onClose]);

    const handleSearch = async (callSign: string) => {
        if (!callSign) {
            setResult(null);
            setMsg(null);
            return;
        }
        setLoading(true);
        try {
            const response = await GetUserByCallSign(callSign.trim());
            if (response.status === "Ok") {
                setResult(response.data[0]);
                setMsg(null);
            } else {
                setResult(null);
                setMsg("User not found");
            }
        } catch (error) {
            setError("An error occurred while searching");
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((callSign: string) => {
            handleSearch(callSign);
        }, 1000),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAddSurveyor = () => {
        if (result) {
            setFormData((prev) => ({
                ...prev,
                surveyors: [
                    ...(prev.surveyors || []),
                    { surveyor_id: result.id },
                ],
            }));
            setCallSigns((prev) => [...prev.split(", ").filter(Boolean), result.call_sign || ""].join(", ")); // Tambahkan call_sign ke UI
            setResult(null);
            setError(null); 
            setSearchInput("");
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <div
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        >
            <div className="fixed inset-0" onClick={onClose}></div>
            {error && (<AlertDialouge key={alertKey} message={error} />)}
            <Card className="relative bg-gray-50 shadow-lg max-w-6xl max-h-svh rounded-lg w-full m-5 md:m-10 overflow-x-scroll xl:overflow-x-hidden z-50 p-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <section>
                        <div className="">
                            <label htmlFor="title" className="text-sm font-semibold">
                                Title:
                            </label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="Title"
                                value={formData.title || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="form_number" className="text-sm font-semibold">
                                Form Number:
                            </label>
                            <Input
                                type="text"
                                id="form_number"
                                placeholder="Form Number"
                                value={formData.form_number || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="questor_name" className="text-sm font-semibold">
                                Questor Name:
                            </label>
                            <Input
                                type="text"
                                id="questor_name"
                                placeholder="Questor Name"
                                value={formData.questor_name || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="fat" className="text-sm font-semibold">
                                FAT:
                            </label>
                            <Input
                                type="text"
                                id="fat"
                                placeholder="FAT"
                                value={formData.fat || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="customer_name" className="text-sm font-semibold">
                                Customer Name:
                            </label>
                            <Input
                                type="text"
                                id="customer_name"
                                placeholder="customer name"
                                value={formData.customer_name || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="address" className="text-sm font-semibold">
                                Address:
                            </label>
                            <Input
                                type="text"
                                id="address"
                                placeholder="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </section>
                    <section>
                        <div className="">
                            <label htmlFor="survey_date" className="text-sm font-semibold">
                                Survey Date:
                            </label>
                            <Input
                                type="date"
                                id="survey_date"
                                placeholder="survey_date"
                                value={
                                    formData.survey_date instanceof Date
                                        ? formData.survey_date.toISOString().split("T")[0]
                                        : formData.survey_date || ""
                                }
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="call_sign" className="text-sm font-semibold">
                                Surveyor Call Sign:
                            </label>
                            <Input
                                type="text"
                                id="call_sign"
                                placeholder="Search call sign"
                                value={searchInput} // Gunakan state searchInput
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchInput(value); // Perbarui nilai input pencarian
                                    debouncedSearch(value); // Lakukan pencarian hanya pada bagian terakhir
                                }}
                                className="border border-gray-300 rounded-md p-2"
                            />
                            {loading && <p className="text-sm text-gray-500">Loading...</p>}
                            {msg && <p className="text-sm text-red-500">{msg}</p>}
                            {result && (
                                <div
                                    className="bg-gray-200 text-sm px-3 py-1 w-max rounded-md cursor-pointer mt-2"
                                    onClick={handleAddSurveyor}
                                >
                                    {result.call_sign}
                                </div>
                            )}
                            <div className="mt-2">
                                <p className="text-sm font-semibold">Selected Surveyors:</p>
                                {callSigns && callSigns.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {callSigns.trim().split(",").map((callSign, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-300 text-sm px-3 py-1 rounded-md"
                                            >
                                                {callSign}
                                            </div>
                                        ))}
                                    </div>
                                )
                                }
                            </div>
                        </div>
                        <section className="flex flex-col justify-center mt-4">
                            <div
                                className="border border-dashed border-gray-400 rounded-md p-3 min-h-52 text-center"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                                onClick={() => document.getElementById("fileInput")?.click()} // Klik input file secara programatik
                            >
                                {!selectedFile && (
                                    <p className="text-sm text-gray-500">Drag and drop an image here, or click to select a file</p>
                                )}
                                <Input
                                    id="fileInput" // Tambahkan ID untuk referensi
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" // Tetap tersembunyi, tetapi dapat diakses melalui klik
                                />
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className={`${selectedFile ? 'mt-0' : 'mt-4'} w-full max-h-36 object-contain`}
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className={`mt-4 px-4 py-2 rounded-md cursor-pointer ${uploading ? "bg-gray-400" : "bg-blue-500 text-white"
                                    }`}
                            >
                                {uploading ? "Uploading..." : "Upload Image"}
                            </button>
                        </section>

                    </section>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!formData.image_id}
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-md ${formData.image_id ? "bg-blue-500 text-white cursor-pointer" : "bg-blue-500/50 cursor-not-allowed"
                            }`}
                    >
                        Submit
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SurveyForm;