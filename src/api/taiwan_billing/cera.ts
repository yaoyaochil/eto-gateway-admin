import {BaseDetailed, BaseResponse} from "@/shared/response/BaseResponse.ts";
import service from "@/utils/request.ts";


/**
 * 获取点券列表
 * @param data
 */
export const getCeraDataList = (data: {account:string, page:number, pageSize:number}):Promise<BaseResponse<BaseDetailed<{
    reg_date: string;
    account: string;
    cera: number;
    mod_date: string;
}[]>>> => {
    return service({
        url: "/taiwan_billing/getCeraList",
        method: "post",
        data
    })
}


/**
 * 充值点券
 * @param data
 */
export const rechargeCera = (data: {account:string, cera:number}):Promise<BaseResponse<null>> => {
    return service({
        url: "/taiwan_billing/rechargeCera",
        method: "post",
        data
    })
}

/**
 * 扣除点券
 * @param data
 */
export const deductionCera = (data: {account:string, cera:number}):Promise<BaseResponse<null>> => {
    return service({
        url: "/taiwan_billing/deductCera",
        method: "post",
        data
    })
}