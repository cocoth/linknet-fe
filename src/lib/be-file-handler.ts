import { ResponseAPI } from "@/types/type";

export const GetAllFile = async (): Promise<ResponseAPI> => {
    const response = await fetch(`/api/files`, {
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

export const GetFile = async (q: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/files/search?filename=${q}`, {
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

export const UploadFile = async (file: File): Promise<ResponseAPI> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/files`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
        body: formData,
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const UpdateFile = async (fileId: string, file: File): Promise<ResponseAPI> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
        body: formData,
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
};

export const DownloadFile = async (fileId: string): Promise<{ success: boolean; data?: any; error?: any }> => {
    const response = await fetch(`/api/files/download?id=${fileId}`, {
        method: "GET",
        credentials: "include", 
    });

    if (!response.ok) {
        return { success: false, error: "Download file failed" };
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = "downloaded_file";
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
};

export const DeleteFile = async (q: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/files?id=${q}`, {
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

