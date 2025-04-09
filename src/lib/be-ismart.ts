import { ISmart, ResponseAPI } from "@/types/type";

export const GetAllISmart = async (): Promise<ResponseAPI> => {
    const response = await fetch(`/api/ismart`, {
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
export const GetISmartByFiberNode = async (fiber: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/ismart?fiber_node=${fiber}`, {
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
export const AddISmart = async (data: ISmart): Promise<ResponseAPI> => {
    const response = await fetch(`/api/ismart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const res:ResponseAPI = await response.json();

    if (!response.ok) {
        return res
    }

    return res
}
export const UpdateIsmart = async (id: string, data: ISmart): Promise<ResponseAPI> => {
    const response = await fetch(`/api/ismart/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const res:ResponseAPI = await response.json();

    if (!response.ok) {
        return res
    }

    return res
}

export const DeleteISmart = async (id: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/ismart/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const res:ResponseAPI = await response.json();

    if (!response.ok) {
        return res
    }

    return res
}