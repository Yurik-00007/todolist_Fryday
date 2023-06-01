import {AxiosResponse} from "axios";
import {instance} from "common/api/common.api";
import {ResponseType} from "common/types/common.types";

//type
export type LoginDataType ={
    email:string
    password:string
    rememberMe?: boolean
    captcha?:string
}

export type meResp = {
    id: number
    email: string
    login: string
}

export const authAPI = {
    login(data: LoginDataType) {
        //console.log(data)
        return instance.post<LoginDataType, AxiosResponse<ResponseType<{ userId: number }>>>(`auth/login`, data)
        // .then(res=>{
        //     debugger
        //     console.log(res.data)
        //     return res.data
        //     })
    },
    me() {
        return instance.get<ResponseType<{ data: meResp }>>(`/auth/me`)
    },
    logout(){
        return instance.delete<ResponseType>(`auth/login`)
    }
}

