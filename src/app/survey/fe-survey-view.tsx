import { Card } from '@/components/ui/card'
import { ConvertDateToString } from '@/lib/utils'
import { Survey, SurveyView } from '@/types/type'
import React from 'react'

const ViewReport = ({ data, onClose }: { data: SurveyView, onClose: () => void }) => {
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
                className="relative bg-gray-50 shadow-lg rounded-lg w-max overflow-x-scroll xl:overflow-x-hidden z-50 p-6"
            >
                <table className='w-full'>
                    <thead className='w-full'>
                        <tr className="border bg-orange-300 text-black">
                            <th className="border border-black px-2 py-1 font-bold">FORM NUMBER</th>
                            <th className="border border-black px-2 py-1 font-bold">QUESTOR NAME</th>
                            <th className="border border-black px-2 py-1 font-bold">FAT</th>
                            <th className="border border-black px-2 py-1 font-bold">NAMA CUSTOMER</th>
                            <th className="border border-black px-2 py-1 font-bold">ALAMAT</th>
                            <th className="border border-black px-2 py-1 font-bold">NODE FDT</th>
                            <th className="border border-black px-2 py-1 font-bold">TANGGAL SURVEY</th>
                            <th className="border border-black px-2 py-1 font-bold">STATUS</th>
                            <th className="border border-black px-2 py-1 font-bold">REMARK</th>
                            <th className="border border-black px-2 py-1 font-bold">SURVEYOR</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        <tr >
                            <td className='border border-black px-2 py-1'>{data.form_number}</td>
                            <td className='border border-black px-2 py-1'>{data.customer_name}</td>
                            <td className='border border-black px-2 py-1'>{data.fat}</td>
                            <td className='border border-black px-2 py-1'>{data.customer_name}</td>
                            <td className='border border-black px-2 py-1'>{data.address}</td>
                            <td className='border border-black px-2 py-1'>{data.node_fdt}</td>
                            <td className='border border-black px-2 py-1'>{ConvertDateToString(`${data.survey_date}`)}</td>
                            <td className='border border-black px-2 py-1'>{data.status}</td>
                            <td className='border border-black px-2 py-1'>{data.remark}</td>
                            <td className='border border-black px-2 py-1'>{data.surveyors?.join(', ')}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    )
}

export default ViewReport