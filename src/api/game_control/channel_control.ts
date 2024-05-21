import service from "@/utils/request.ts";
import {BaseDetailed, BaseResponse} from "@/shared/response/BaseResponse.ts";
import {ChannelConfig} from "@/shared/response/ChannelControl.ts";


export const getChannelList = (data:{page:number, pageSize:number}):Promise<BaseResponse<BaseDetailed<ChannelConfig[]>>> => {
    return service({
        url: '/channel/getChannelList',
        method: 'post',
        data
    });
}

export const createChannel = (data:ChannelConfig):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/createChannel',
        method: 'post',
        data
    });
}


export const updateChannel = (data:ChannelConfig):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/updateChannel',
        method: 'post',
        data
    });
}

export const deleteChannel = (data:{GCNo:number}):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/deleteChannel',
        method: 'post',
        data
    });
}


export const startChannel = (data:{GCNo:number}):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/startChannel',
        method: 'post',
        data
    });
}

export const stopChannel = (data:{GCNo:number}):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/stopChannel',
        method: 'post',
        data
    });
}

export const restartChannel = (data:{GCNo:number}):Promise<BaseResponse<null>> => {
    return service({
        url: '/channel/restartChannel',
        method: 'post',
        data
    });
}

export const getChannelStatus = (data:{GCNo:number}):Promise<BaseResponse<{status:number}>> => {
    return service({
        url: '/channel/getChannelStatus',
        method: 'post',
        data
    });
}

export const getChannelStatusByIds = (data:{ids:number[]}):Promise<BaseResponse<{GCNo:number, IsRunning:boolean}[]>> => {
    return service({
        url: '/channel/GetChannelStatusByGCNos',
        method: 'post',
        data
    });
}