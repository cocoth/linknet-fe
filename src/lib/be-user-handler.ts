import { ResponseAPI, User } from "@/types/type";


export const AddUser = async(user:User)=>{
    const response = await fetch(`/api/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });

    const data:ResponseAPI = await response.json();

    if (!response.ok) {
        return data
    }

    return data
}

export const GetAllUsers = async()=>{
    const response = await fetch(`/api/users`, {
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

export const GetAllRole = async()=>{
    const response = await fetch(`/api/user/roles`, {
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

export const GetUserById = async (id: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/user?id=${id}`, {
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

export const GetUserByName = async (name: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/users?name=${name}`, {
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
export const GetUserByCallSign = async (callsign: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/users?call_sign=${callsign}`, {
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

export const UpdateUser = async (userId: string, user: User): Promise<ResponseAPI> => {
    const response = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
    });

    const data:ResponseAPI = await response.json();
    
    if (!response.ok) {
        return data
    }

    return data
}

export const DeleteUser = async (userId: string): Promise<ResponseAPI> => {
    const response = await fetch(`/api/user/${userId}`, {
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