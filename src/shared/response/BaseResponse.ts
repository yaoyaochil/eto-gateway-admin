


export interface BaseResponse<T> {
    code: number;
    message: string;
    data: T;
}


export interface BaseDetailed<T> {
    list: T;
    total: number;
    page: number;
    pageSize: number;
}