"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { AiFillFileAdd } from "react-icons/ai";

interface FileDropProps {
    onClose: () => void;
    onUpload: (file: File) => void;
    fileName?: string; // Nama file yang sedang diedit (opsional)
}

export const FileDrop = ({ onClose, onUpload, fileName }: FileDropProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile); // Trigger the upload function
            setSelectedFile(null); // Reset the selected file
            onClose(); // Close the popup
        } else {
            alert("Please select a file to upload.");
        }
    };

    return (
        <div>
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
                    zIndex: 999,
                }}
                onClick={onClose} // Close popup when clicking outside
            ></div>

            {/* Popup */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Center the popup
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    width: "400px",
                    textAlign: "center",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="justify-center"
            >
                <h2 className={`text-lg font-bold ${fileName ? '' : 'mb-4'}`}>{fileName ? `Edit File:` : "Upload File"}</h2>
                {fileName && (
                    <h3 className="text-lg font-semibold mb-4">{fileName}</h3>
                )}
                <div
                    style={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                    <AiFillFileAdd className="w-12 h-12 text-blue-500 mx-auto" />
                    <p className="text-gray-500 mt-2">
                        Drag and drop a file here, or click to select a file
                    </p>
                </div>
                <input
                    id="fileInput"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                {selectedFile && (
                    <p className="text-sm text-gray-700 mt-2">
                        Selected file: {selectedFile.name}
                    </p>
                )}
                <div className="flex space-x-3 justify-around mt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleUpload} className="bg-blue-500">
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};