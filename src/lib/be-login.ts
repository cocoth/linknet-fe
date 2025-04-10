import { ResponseAPI } from "@/types/type";

export async function HandleLogin(
  emailphone: string,
  password: string
): Promise<ResponseAPI> {
  try {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: emailphone, phone: emailphone, password }),
    });


    const data:ResponseAPI = await response.json();
    
    if (!response.ok) {
      return data
    }

    return data
  } catch (error) {
    return {
      code: 400,
      status: "error",
      message: "An error occurred during login",
      data: null,
    }
  }
}

export async function HandleLogout(): Promise<ResponseAPI> {
  try {
    const response = await fetch(`/api/logout`, {
      method: "POST",
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
  } catch (error) {
    return {
      code: 400,
      status: "error",
      message: "An error occurred during logout",
      data: null,
    }
  }
}