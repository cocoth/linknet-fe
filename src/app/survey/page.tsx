"use client"
import { AlertDialouge, ConfirmDialog } from '@/components/custom/alert-dialogue'
import Navbar from '@/components/custom/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AddSurvey, DeleteSurvey, DownloadSurveyReportAsExcel, GetSurveyByTitle, GetSurveys, GetViewReport, UpdateSurvey } from '@/lib/be-survey-handler'
import { UpdateUser } from '@/lib/be-user-handler'
import { ConvertDateToString, debounce } from '@/lib/utils'
import { Survey, SurveyView } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import { FaFileExcel, FaPen } from 'react-icons/fa'
import { FaMagnifyingGlass, FaRegTrashCan } from 'react-icons/fa6'
import ViewReport from './fe-survey-view'
import { IoMdDownload } from "react-icons/io";
import SurveyForm from '@/components/custom/survey-form'


const SurveyPage = () => {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [data, setData] = useState<Survey | null>(null)
    const [dataToDelete, setDataToDelete] = useState<Survey | null>(null)
    const [dataToEdit, setDataToEdit] = useState<Survey | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    
    const [alertKey, setAlertKey] = useState<number>(0)
    const [dialogue, setDialogue] = useState<boolean>(false)

    const [surveyView, setSurveyView] = useState(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [report, setReport] = useState<SurveyView | null>(null)


    const showAlert = (msg: string) => {
        setAlertKey((p) => p + 1)
        setError(msg)
    }

    useEffect(() => {
        const fetchSurveys = async () => {
            setLoading(true)
            const result = await GetSurveys()
            if (result.status === "Ok") {
                setSurveys(result.data)
                setError(null)
            } else {
                showAlert(result.message || "Failed to fetch surveys")
            }
            setLoading(false)
        }
        fetchSurveys()
    }, [])

    const handleSearch = async (q: string) => {
        const lq = q.toLowerCase()
        try {
            setLoading(true)
            const result = await GetSurveyByTitle(lq)
            if (result.status === "Ok") {
                setSurveys(result.data)
                setError(null)
            } else {
                showAlert(result.message || "Failed to search survey")
            }
            setLoading(false)
        } catch (error) {
            showAlert("Error to search survey");
        }
    }
    const debounceSearch = debounce(handleSearch, 2000);

    const handleDownloadFile = async (report: Survey) => {
        const result = await DownloadSurveyReportAsExcel(report.id!);
        if (result.success) {
            const { fileUrl, fileName } = result.data;

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = fileName;
            a.click();
            setTimeout(() => {
                URL.revokeObjectURL(fileUrl)
            }, 1000 * 15)
        } else {
            showAlert("Error to download file");
        }
    }

    const handleEditSurvey = async (survey: Survey) => {
        if (dataToEdit) {
            try {
                const result = await UpdateSurvey(dataToEdit.id!, survey);
                if (result.status === "Ok") {
                    setSurveys((prev) =>
                        prev.map((u) => (u.id === dataToEdit.id ? { ...u, ...data } : u))
                    );
                }
            } catch (error) {
                showAlert("Error to edit survey");
            }
        }
    };

    const handleViewReport = async (report: Survey) => {
        try {
            const result = await GetViewReport(report.id!)
            if (result.status === "Ok") {
                setReport(result.data)
                setError(null)
            } else {
                showAlert(result.message || "Failed to fetch report")
            }
        } catch (error) {
            showAlert("Error to view report");
        }
    }

    const handleAddSurvey = async (survey: Survey)=>{
        try {
            const response = await AddSurvey(survey)
            if (response.status === "Ok") {
                setSurveys((prev) => [...prev, response.data])
                setError(null)
            } else {
                showAlert(response.message || "Failed to add survey")
            }
        } catch (error) {
            showAlert("Failed to add survey");
            
        }
    }

    const handleDeleteWo = async () => {
        if (dataToDelete) {
            try {
                const result = await DeleteSurvey(dataToDelete.id!);
                if (result.status === "Ok") {
                    window.location.reload()
                } else {
                    showAlert(`Failed to delete user: ${dataToDelete.title}`)
                }
            } catch (error) {
                showAlert("Failed to delete user");
            }
        }
    };


    const handleDeleteClick = (survey: Survey) => {
        setDataToDelete(survey)
        setDialogue(true)
    }
    const handleCacelDelete = () => {
        setDialogue(true)
        setDataToDelete(null)
    }


    return (
        <main>
            <Navbar />
            {error && <AlertDialouge key={alertKey} message={error} />}
            {dialogue
                && <ConfirmDialog
                    message={`Are you sure want to delete: "${dataToDelete?.title}" ?`}
                    onConfirm={handleDeleteWo}
                    onCancel={handleCacelDelete}
                />}
            <div className="p-4 md:mx-10 mb-24">
                <section>
                    <div className="mb-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search work order..."
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
                    {loading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className='h-20 w-full' />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {surveyView && report && (
                                <ViewReport data={report} onClose={()=>setSurveyView(false)} />
                            )}
                            {surveys.map((wo, index) => (
                                <li
                                    onClick={() => {
                                        setSurveyView(true)
                                        handleViewReport(wo)
                                    }}
                                    key={index}
                                    className="flex justify-between border p-2 rounded-lg shadow hover:bg-orange-200 hover:cursor-pointer"
                                >
                                    <div className="flex space-x-3">
                                        <div className="">
                                            <FaFileExcel className='w-10 h-full text-green-500' />
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className='font-bold text-black'>
                                                {wo.title && wo.title.length > 30 ? `${wo.title.substring(0, 30)}...` : wo.title}
                                            </h1>
                                            <p className='font-medium text-sm text-gray-500'>{ConvertDateToString(wo.CreatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center mx-2">
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadFile(wo)
                                            }}
                                            className='cursor-pointer hover:bg-gray-100 p-2 rounded-md mr-2'
                                        >
                                            <IoMdDownload className='w-5 text-xl h-full' />
                                        </button>
                                        <Button
                                            type='button'
                                            variant={"ghost"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDataToEdit(wo); // Set the survey to edit
                                                setIsVisible(true); // Open the SurveyForm
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
                                                handleDeleteClick(wo);
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
                            onClick={() =>{ 
                                setDataToEdit(null)
                                setIsVisible(true)
                            }}
                        >
                            <AiFillPlusCircle className="w-8 md:w-12 h-max" />
                        </div>
                    </div>
                    {isVisible && (
                        <SurveyForm
                            survey={dataToEdit || undefined}
                            onSubmit={dataToEdit ? handleEditSurvey : handleAddSurvey}
                            onClose={() => setIsVisible(false)}
                        />
                    )}
                </section>
            </div>
        </main>
    )
}

export default SurveyPage