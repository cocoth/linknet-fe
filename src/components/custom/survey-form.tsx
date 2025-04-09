"use client"

import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Survey } from '@/types/type';


interface SurveyFormProps {
    onClose: () => void;
    onSubmit: (data: Survey) => void;
    survey: Survey
}

const SurveyForm = ({ onClose, onSubmit, survey }: SurveyFormProps) => {
    const [formData, setFormData] = useState<Survey>({
        ...survey,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
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
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>
            <Card>
            <div className="grid grid-cols-2 gap-4">
                    <section>
                        <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-4">
                            <label htmlFor="customer_name" className="text-sm font-semibold">
                                Customer Name:
                            </label>
                            <Input
                                type="text"
                                id="customer_name"
                                placeholder="Customer Name"
                                value={formData.customer_name || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="address" className="text-sm font-semibold">
                                Address:
                            </label>
                            <Input
                                type="text"
                                id="address"
                                placeholder="Address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </section>
                    <section>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="node_fdt" className="text-sm font-semibold">
                                Node FDT:
                            </label>
                            <Input
                                type="text"
                                id="node_fdt"
                                placeholder="Node FDT"
                                value={formData.node_fdt || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="survey_date" className="text-sm font-semibold">
                                Survey Date:
                            </label>
                            <Input
                                type="date"
                                id="survey_date"
                                value={formData.survey_date ? formData.survey_date.toString() : ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="status" className="text-sm font-semibold">
                                Status:
                            </label>
                            <Input
                                type="text"
                                id="status"
                                placeholder="Status"
                                value={formData.status || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="remark" className="text-sm font-semibold">
                                image:
                            </label>
                            <Input
                                type="text"
                                id="image"
                                placeholder="image"
                                value={formData.remark || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="surveyor" className="text-sm font-semibold">
                                Surveyors:
                            </label>
                            <Input
                                type="text"
                                id="surveyor"
                                placeholder="Surveyor"
                                value={formData.surveyors?.[0]?.surveyor_id || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        surveyors: [
                                            { ...prev.surveyors?.[0], surveyor_id: e.target.value },
                                        ],
                                    }))
                                }
                                className="border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </section>
                </div>
            </Card>
        </div>
    )
}

export default SurveyForm