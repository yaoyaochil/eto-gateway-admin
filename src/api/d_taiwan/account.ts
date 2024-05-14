import service from "@/utils/request.ts";
import {BaseDetailed, BaseResponse} from "@/shared/response/BaseResponse.ts";
import {DTaiwanAccountInfo} from "@/shared/response/DTaiwanAccountInfo.ts";


export const getDTaiwanAccountList = (data:{ page:number, pageSize:number,UID:number,accountname:string}):Promise<BaseResponse<BaseDetailed<DTaiwanAccountInfo[]>>> => {
    return service({
        url: "/d_taiwan/getAccountList",
        method: "post",
        data
    })
}

export const resetCreateLimit = (data:{UID:number}):Promise<BaseResponse<null>> => {
    return service({
        url: "/d_taiwan/resetLimitCreateCharacter",
        method: "post",
        data
    })
}