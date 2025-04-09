import { ResponseAPI, Survey } from "@/types/type";


export const AddSurvey = async(survey:Survey)=>{
    const response = await fetch(`/api/surveys`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(survey),
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const GetSurveys = async()=>{
    const response = await fetch(`/api/surveys`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const GetSurveyByTitle = async(title: string)=>{
    const response = await fetch(`/api/surveys?title=${title}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}


export const UpdateSurvey = async (id: string, survey: Survey): Promise<ResponseAPI> => {
    const response = await fetch(`/api/surveys/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(survey),
    });

    const data:ResponseAPI = await response.json();
    
    if (!response.ok) {
        return data
    }

    return data
}

export const DeleteSurvey = async (id: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const GetViewReport = async (id: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/survey/opt/view/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const DownloadSurveyReportAsExcel = async (id: string): Promise<{success: boolean, data?:any, error?: any}> => {
    const response = await fetch(`/api/survey/opt/download/${id}`, {
        method: "GET",
        credentials: "include",
    });

    
    if (!response.ok) {
        const msg = await response.json();
        return { success: false, error: msg.message };
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = "report";
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
            fileName = match[1];
        }
    }
    const data = {
        fileUrl: URL.createObjectURL(blob),
        fileName,
    };

    return { success: true, data };
}