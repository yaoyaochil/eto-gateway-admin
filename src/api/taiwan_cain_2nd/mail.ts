import {MailRequest} from "@/shared/response/Mail.ts";
import {BaseResponse} from "@/shared/response/BaseResponse.ts";
import service from "@/utils/request.ts";

/**
 * 发送邮件
 * @param data {MailRequest} 发送邮件
 */
export const sendMail = (data: MailRequest):Promise<BaseResponse<null>> => {
    return service({
        url: '/email/sendEmail',
        method: 'post',
        data
    })
}