"use client"

import { Button } from '../ui/button'
import { Card } from '../ui/card'
import React, { useEffect, useState } from 'react'

export const AlertDialouge = ({ message }: { message: string }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [message])

    const handleOkClick = () => {
        setIsVisible(false)
    }

    return (
        isVisible &&
        <div>
            {/* Overlay to block interactions */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
                    zIndex: 999, // Above other elements
                }}
                onClick={handleOkClick} // Close dialog when clicking on the overlay
            ></div>

            {/* Dialog */}
            <div
                style={{
                    position: 'fixed',
                    top: '5%', // Positioned near the top
                    left: '50%',
                    transform: 'translate(-50%, 0)', // Center horizontally, no vertical adjustment
                    transition: 'all 0.5s ease',
                    opacity: isVisible ? 1 : 0,
                    zIndex: 1000, // Above the overlay
                }}
            >
                <Card
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        animation: 'slideDown 0.5s ease',
                    }}
                >
                    <p>{message.length > 40 ? `${message.substring(0, 40)} ...` : message}</p>
                    <Button variant={"default"} onClick={handleOkClick}>Ok</Button>
                </Card>
            </div>
            <style>
                {`
                    @keyframes slideDown {
                        from {
                            transform: translateY(-100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideUp {
                        from {
                            transform: translateY(0);
                        }
                        to {
                            transform: translateY(-100%);
                        }
                    }
                `}
            </style>
        </div>
    )
}


interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
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
                onClick={onCancel} // Close dialog when clicking on the overlay
            ></div>

            {/* Dialog */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Center the dialog
                    zIndex: 1000,
                }}
            >
                <Card
                    style={{
                        padding: "20px",
                        textAlign: "center",
                    }}
                >
                    <p>{message.length > 50 ? `${message.substring(0, 50)} ...` : message}</p>
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
                        <Button variant="ghost" onClick={onCancel} className='cursor-pointer'>
                            No
                        </Button>
                        <Button variant="default" onClick={onConfirm} className='cursor-pointer'>
                            Yes
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};