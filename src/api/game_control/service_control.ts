import service from "@/utils/request.ts";
import {BaseResponse} from "@/shared/response/BaseResponse.ts";


// 获取主服务状态
export const getMainServiceStatus = async ():Promise<BaseResponse<string[]>> => {
    return service({
        url: "/main_service_control/status",
        method: 'get',
    })
}

// 启动主服务
export const startMainService = async ():Promise<BaseResponse<string>> => {
    return service({
        url: "/main_service_control/start",
        method: 'get',
    })
}

// 终止主服务
export const stopMainService = async ():Promise<BaseResponse<string>> => {
    return service({
        url: "/main_service_control/stop",
        method: 'get',
    })
}