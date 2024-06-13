import {Alert, Avatar, Button, Form, Input, InputNumber, List, Select} from "antd";
import {GameItem} from "@/shared/response/GameItem.ts";
import {useCallback, useEffect, useState} from "react";
import {MailRequest} from "@/shared/response/Mail.ts";
import {message} from "@/shared/EscapeAntd.tsx";
import {sendMail} from "@/api/taiwan_cain_2nd/mail.ts";
import {MailOutlined,GiftOutlined} from "@ant-design/icons";

export default function Page() {
    const [data, setData] = useState<GameItem[]>([]);
    const form = Form.useForm<MailRequest>()[0];


    useCallback(() => {
        console.log(form)
    }, [form]);

    // 发送邮件
    const onFinish = async (values: MailRequest) => {
        if (values.charNo === 0) {
            message.error('请输入正确接收角色ID');
            return
        }
        const res = await sendMail(values);
        if (res.code !== 0) {
            message.error('发送失败');
            return
        }
        message.success('发送成功');
    }

    useEffect(() => {
        form.setFieldValue('sendCharName', '系统邮件');
        form.setFieldValue('letterText', '系统邮件,请勿回复');
        form.setFieldValue('add_info', 0);
        setData([
            {
                ID: 1,
                ItemName: '永恒之守护手镯',
                ItemNo: 1001,
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 2,
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 3,
                ItemName: '道具3',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 4,
                ItemName: '道具4',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 5,
                ItemName: '道具5',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 6,
                ItemName: '道具6',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 7,
                ItemName: '道具7',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 8,
                ItemName: '道具8',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 9,
                ItemName: '道具9',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            },
            {
                ID: 10,
                ItemName: '道具10',
                ItemIcon: 'http://i1.17173cdn.com/imgt89/YWxqaGBf/images/data/item/new_equipment/09_bracelet/bracelet.img_83.png'
            }
        ]);
    }, []);

    return (
        <div className={'w-full h-full grid grid-cols-4 gap-5'}>
            <div className={'col-span-1 p-4 rounded-xl bg-white overflow-hidden flex flex-col gap-3'}>
                <Alert showIcon icon={<GiftOutlined />} message="道具列表" type="info"/>
                <div className={'flex gap-3'}>
                    <Input type="text" placeholder={'搜索道具'}/>
                    <Button type={'primary'}>搜索</Button>
                </div>
                <div className={'overflow-auto p-3'}>
                    <List>
                        {data.map((item) => (
                            <List.Item key={item.ID}>
                                <span className={'flex gap-3 items-center h-full w-full group'}>
                                    <Avatar src={item.ItemIcon} size={'large'}/>
                                    <span className={'flex-1 grid grid-rows-2 items-center'}>
                                        <span className={'text-amber-400 text-nowrap truncate'}>{item.ItemName?item.ItemName:'未知道具'}</span>
                                        <span className={'text-xs text-gray-400'}>{item.ItemDesc?item.ItemDesc:'暂无描述'}</span>
                                    </span>
                                    <div className={`mr-3 group-hover:opacity-100 transition-all duration-300`}>
                                        <Button type={'default'} onClick={()=> form.setFieldValue('item_id',item.ItemNo)}>选择物品</Button>
                                    </div>
                                </span>
                            </List.Item>
                        ))}
                    </List>
                </div>
            </div>
            <div className={'col-span-3 p-4 rounded-xl bg-white flex flex-col gap-4 overflow-hidden'}>
                <Alert showIcon icon={<MailOutlined/>} message="邮件发送" type="info"/>
                <div className={'w-full flex-1'}>
                    <Form form={form} className={'w-full flex flex-col gap-4'} layout={'inline'} onFinish={onFinish}>
                        <div className={'flex flex-col gap-4'}>
                            <Form.Item<MailRequest> label={'发送者'} name={'sendCharName'} rules={[{required:true,message:'必须输入发送者'}]}>
                                <Input className={'row-span-1'} placeholder={'邮件发送者'} defaultValue={'系统邮件'}/>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'邮件内容'} name={'letterText'}>
                                <Input.TextArea className={'row-span-1'} autoSize={{minRows:5}} placeholder={'邮件内容'} defaultValue={'系统邮件,请勿回复'}/>
                            </Form.Item>
                        </div>
                        <div className={'grid grid-cols-4 gap-4'}>
                            <Form.Item<MailRequest> label={'角色ID'} name={'charNo'} rules={[{required: true, message: '请输入接收者角色ID'}]}>
                                <InputNumber className={'w-full'} placeholder={'角色ID'}/>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'道具ID'} name={'item_id'}>
                                <InputNumber className={'w-full'} placeholder={'道具ID'}/>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'道具数量'} name={'add_info'} rules={[{required: true, message: '请输入数量'}]}>
                                <InputNumber className={'w-full'} placeholder={'数量'}/>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'强化数值'} name={'upgrade'}>
                                <InputNumber className={'w-full'}/>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'锻造等级'} name={'seperate_upgrade'}>
                                <InputNumber className={'w-full'} />
                            </Form.Item>
                            <Form.Item<MailRequest> label={'增幅属性'} name={'amplify_option'} className={'min-w-36'}>
                                <Select >
                                    <Select.Option value={1}>体力</Select.Option>
                                    <Select.Option value={2}>精神</Select.Option>
                                    <Select.Option value={3}>力量</Select.Option>
                                    <Select.Option value={4}>智力</Select.Option>
                                    <Select.Option value={0}>无</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'是否封装'} name={'seal_flag'}>
                                <Select >
                                    <Select.Option value={0}>未封装</Select.Option>
                                    <Select.Option value={1}>封装</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item<MailRequest> label={'金币'} name={'gold'}>
                                <InputNumber className={'w-full'}  placeholder={'金币'}/>
                            </Form.Item>
                        </div>
                        <div className={'w-full flex justify-end'}>
                            <Form.Item>
                                <Button htmlType={'submit'} type={'primary'}>发送邮件</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}