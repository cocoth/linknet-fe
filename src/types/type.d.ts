export interface Login{
    emailphone: string
    password: string
}

export interface User {
    id?: string
    name?: string
    email?: string
    phone?: string
    password?: string
    call_sign?: string
    contractor?: string
    status?: string
    role?: {
        name: string
    }
}
export interface FileData {
    id: string
    file_name: string;
    file_type: string
    author_id: string
    CreatedAt: string;
}
export interface Survey{
    id?: string
    title?: string
    form_number?: string
    questor_name?: string
    fat?: string
    customer_name?: string
    address?: string
    node_fdt?: string
    survey_date?: Date
    surveyors?: {
        id?: string
        survey_id?: string
        surveyor_id?: string
    }[]
    image_id?: string
    CreatedAt: string
}

export interface SurveyView{
    id?: string
    title?: string
    form_number?: string
    questor_name?: string
    fat?: string
    customer_name?: string
    address?: string
    node_fdt?: string
    survey_date?: string
    status?: string
    remark?: string
    surveyors?: string[]
    CreatedAt: string
}

export interface ISmart {
    id?: string
    fiber_node?: string
    address?: string
    coordinate?: string
    street?: string
    CreatedAt?: string
}


export interface ResponseAPI{
    code: number
    status: string
    message?: string
    data?: any
}