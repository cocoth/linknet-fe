"use client";

import Navbar from '@/components/custom/navbar';
import React, { useEffect, useState } from 'react';
import { DeleteFile, DownloadFile, GetAllFile, GetFile, UpdateFile, UploadFile } from '@/lib/be-file-handler';
import { Skeleton } from '@/components/ui/skeleton';
import { FaFile, FaFileImage, FaFilePdf, FaPen } from 'react-icons/fa';
import { FcGlobe } from "react-icons/fc";

import { AiFillFileAdd } from "react-icons/ai";

import { FaRegTrashCan } from "react-icons/fa6";
import { Input } from '@/components/ui/input';
import { ConvertDateToString, debounce } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { AlertDialouge, ConfirmDialog } from '@/components/custom/alert-dialogue';
import { FileDrop } from '@/components/custom/file-drop';
import { FileData } from '@/types/type';


const Dashboard = () => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState("")
    const [alertKey, setAlertKey] = useState(0)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)
    const [isFileDropVisible, setIsFileDropVisible] = useState(false);
    const [fileToEdit, setFileToEdit] = useState<FileData | null>(null);


    const showAlert = (msg: string) => {
        setAlertKey((p) => p + 1)
        setError(msg)
    }

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            const result = await GetAllFile();
            if (result.status === "Ok") {
                setFiles(result.data.filter((file: FileData) => {
                    const fileExtension = file.file_name.split('.').pop()?.toLowerCase();
                    return fileExtension === "kmz" || fileExtension === "pdf";
                }));
                setError(null);
            } else {
                showAlert(result.message || "Failed to fetch files");
            }
            setLoading(false);
        };

        fetchFiles();
    }, []);

    async function handleFileUpload(file: File) {
        try {
            setLoading(true);
            const result = await UploadFile(file);
            if (result.status === "Ok") {
                setFiles((prevFiles) => [...prevFiles, result.data]); // Tambahkan file baru ke daftar
            } else {
                showAlert(result.message || "Failed to upload file");
            }
        } catch (error) {
            showAlert(`Error uploading file: ${file.name}`);
        } finally {
            setLoading(false);
            setIsFileDropVisible(false);
        }
    };

    const handleEditClick = (file: FileData) => {
        setFileToEdit(file);
        setIsFileDropVisible(true);
    };

    const handleFileEdit = async (file: File) => {
        if (fileToEdit) {
            try {
                setLoading(true);
                const result = await UpdateFile(fileToEdit.id, file);
                if (result.status === "Ok") {
                    showAlert(`Successfully updated file: ${fileToEdit.file_name}`);
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            f.id === fileToEdit.id ? { ...f, file_name: result.data.file_name } : f
                        )
                    );
                } else {
                    showAlert(`Failed to update file: ${fileToEdit.file_name}`);
                }
            } catch (error) {
                showAlert(`Error updating file: ${fileToEdit.file_name}`);
            } finally {
                setLoading(false);
                setIsFileDropVisible(false);
                setFileToEdit(null);
            }
        }
    };

    async function handleDownloadFile(fileId: string) {
        const result = await DownloadFile(fileId);
        if (result.success) {
            const { fileUrl, fileName } = result.data;

            const fileExtension = fileName.split(".").pop()?.toLowerCase();
            const previewableExtensions = ["jpg", "jpeg", "png", "pdf"];

            if (fileExtension && previewableExtensions.includes(fileExtension)) {
                window.open(fileUrl, "_blank");
            } else {
                const a = document.createElement("a");
                a.href = fileUrl;
                a.download = fileName;
                a.click();

                URL.revokeObjectURL(fileUrl)
            }
        } else {
            alert("Failed to download file");
        }
    }

    async function handleSearch(query: string) {
        const lowerCaseQuery = query.toLowerCase();
        try {
            setLoading(true)
            const result = await GetFile(lowerCaseQuery);
            if (result.status === "Ok") {
                setFiles(result.data.filter((file: FileData) => {
                    const fileExtension = file.file_name.split('.').pop()?.toLowerCase();
                    return fileExtension === "kmz" || fileExtension === "pdf";
                }));
                setError(null)
            } else {
                showAlert(result.message || "Failed to fetch files");
            }
            setLoading(false);
        } catch (error) {
            setFiles([])
        }
    }

    async function handleDelete() {
        if (fileToDelete) {

            try {
                setLoading(true);
                const result = await DeleteFile(fileToDelete.id);
                if (result.status === "Ok") {
                    setMsg(`successfully delete file: ${fileToDelete.file_name}`);
                    window.location.reload();
                } else {
                    showAlert(`Failed to delete file: ${fileToDelete?.file_name}`)
                }
                setError(null)
            } catch (error) {
                showAlert(`Error deleting file: ${fileToDelete.file_name}`)
            } finally {
                setLoading(false);
                setIsConfirmVisible(false);
                setFileToDelete(null);
            }
        }
    }

    const handleDeleteClick = (file: FileData) => {
        setFileToDelete(file)
        setIsConfirmVisible(true)
    }
    const handleCacelDelete = () => {
        setIsConfirmVisible(false)
        setFileToDelete(null)
    }
    const debounceSearch = debounce(handleSearch, 2000);


    return (
        <main>
            <Navbar />
            {error && <AlertDialouge key={alertKey} message={error} />}
            {isConfirmVisible
                && <ConfirmDialog
                    message={`Are you sure want to delete the file: "${fileToDelete?.file_name}" ?`}
                    onConfirm={handleDelete}
                    onCancel={handleCacelDelete}
                />}
            <div className="p-4 md:mx-10 mb-24">
                <section>
                    <div className="mb-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search files..."
                                className="pl-10 h-12"
                                onChange={(e) => {
                                    e.preventDefault()
                                    const value = e.target.value;
                                    debounceSearch(value);
                                }}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaFile className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className='h-20 w-full' />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {files.map((file, index) => (
                                <li
                                    onClick={() => { handleDownloadFile(file.id) }}
                                    key={index}
                                    className="flex justify-between border p-2 rounded-lg shadow hover:bg-orange-200 hover:cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <div className="">
                                            {
                                                (() => {
                                                    const fileExtension = file.file_name.split('.').pop()?.toLowerCase();
                                                    return fileExtension === "pdf" ? (
                                                        <FaFilePdf className='w-10 h-full text-red-400' />
                                                    ) : fileExtension === "kmz" ? (
                                                        <FcGlobe className='w-10 h-full' />
                                                    ) : fileExtension === "jpeg" || fileExtension === "jpg" || fileExtension === "png" ? (
                                                        <FaFileImage className='w-10 h-full' />
                                                    ) : (
                                                        <FaFile className='w-10 h-full' />
                                                    );
                                                })()
                                            }
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className='font-bold text-black'>
                                                {file.file_name.length > 30 ? `${file.file_name.substring(0, 30)}...` : file.file_name}
                                            </h1>
                                            <p className='font-medium text-sm text-gray-500'>{ConvertDateToString(file.CreatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center mx-2">
                                        <Button
                                            type='button'
                                            variant={"ghost"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(file);
                                            }}
                                            className='cursor-pointer'
                                        >
                                            <FaPen className='w-5 h-full' />
                                        </Button>
                                        <div className="border-r w-3 h-full border-gray-400 mx-3"></div>
                                        <Button
                                            type='button'
                                            variant={"ghost"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(file);
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
                {/* section for floating plus button */}
                <section>
                    <div className="fixed bottom-5 right-5 z-50">
                        <div
                            className='group cursor-pointer bg-blue-500 text-white p-2 md:p-4 shadow-lg shadow-black rounded-full hover:bg-blue-600'
                            onClick={() => setIsFileDropVisible(true)}
                        >
                            <AiFillFileAdd className="w-8 md:w-12 h-max" />
                        </div>
                    </div>
                    {isFileDropVisible && (
                        <FileDrop
                            onClose={() => {
                                setIsFileDropVisible(false);
                                setFileToEdit(null);
                            }}
                            onUpload={fileToEdit ? handleFileEdit : handleFileUpload}
                            fileName={fileToEdit?.file_name}
                        />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Dashboard;