import {BaseDetailed, BaseResponse} from "@/shared/response/BaseResponse.ts";
import {TaiwanCainCharacterInfo} from "@/shared/response/TaiwanCain.ts";
import service from "@/utils/request.ts";

// 分页获取角色列表
export const getCharacterList = (data: {
    m_id: number;
    page: number;
    pageSize: number;
}):Promise<BaseResponse<BaseDetailed<TaiwanCainCharacterInfo[]>>> => {
    return service({
        url: '/charac_info/getCharacInfoList',
        method: 'post',
        data
    })
}