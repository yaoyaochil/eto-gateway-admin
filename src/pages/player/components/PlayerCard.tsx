import {Button, Dropdown, Empty, Tag} from "antd";
import type { MenuProps } from 'antd';
import {CopyOutlined,MenuOutlined} from "@ant-design/icons";
import {message} from "@/shared/EscapeAntd.tsx";
import {DTaiwanAccountInfo} from "@/shared/response/DTaiwanAccountInfo.ts";
import {useCharacterStore} from "@/store/characterStore.tsx";
import {resetCreateLimit} from "@/api/d_taiwan/account.ts";


type PlayerCardProps = {
    data: DTaiwanAccountInfo[];
}

const items: MenuProps['items'] = [
    {
        label: '重置创建限制',
        key: '1',
    }
];


export default function PlayerCardComponent(props: PlayerCardProps) {
    const setSelectMId = useCharacterStore(state => state.setMId);

    const resetLimitCreateCharacter = async (uid: number) => {
        const res = await resetCreateLimit({UID: uid});
        if (res.code === 0) {
            message.success("重置成功");
        } else {
            message.error(res.msg);
        }
    }

    const runFuncByKey = async (key: string,data: unknown) => {
        switch (key) {
            case '1':
                if (data) {
                    await resetLimitCreateCharacter((data as {uid: number}).uid);
                }
                break;
            default:
                break;
        }
    }

    const handleMenuClick = (data: {key:string,uid: number}) => {
        runFuncByKey(data.key,data);
    }

    const copyToClipboard = (data: string) => {
        navigator.clipboard.writeText(data).then(() => {
            message.success("复制成功");
        }).catch(() => {
            message.error("复制失败");
        });
    }

    return (
        <div className={"w-full h-full flex flex-col gap-3 overflow-auto"}>
            {
                props.data && props.data.map((item, index) => {
                    return (
                        <div className={"cursor-pointer border-2 w-full rounded-xl hover:border-blue-500 transition-all duration-200"} key={index}>
                            <div className={"h-16 flex items-center justify-start pl-3 gap-2 w-full"}>
                                {/*<Avatar size={40} src={<SystemLogoIcon className="w-10 h-10 bg-black"/>}/>*/}
                                <div className={"flex flex-col"}>
                                    <span className={"flex items-center overflow-ellipsis justify-start leading-6"}>
                                        <span className={"whitespace-nowrap"}>账户：</span>
                                        <span className={"whitespace-nowrap"}>{item.accountname}</span>
                                    </span>
                                    <span className={"flex items-center justify-start w-28 leading-6"}>
                                        <span className={"whitespace-nowrap text-gray-400 text-xs"}>UID：</span>
                                        <span className={"whitespace-nowrap text-gray-400 text-xs"}>
                                            {/*自动补齐为8位显示*/}
                                            {item.UID.toString().padStart(8, '0')}
                                        </span>
                                        <Button icon={<CopyOutlined/>} size={"small"} type={"link"} className={"ml-1"}
                                                onClick={() => copyToClipboard(String(item.UID))}/>
                                    </span>
                                </div>
                                <div className={"grid grid-rows-2 ml-3"}>
                                    <Button type={"link"} size={"small"} onClick={() => setSelectMId(item.UID)}>详情</Button>
                                    {
                                        item.isHack === 1 ? <Button type={"link"} size={"small"}>解封</Button> :
                                            <Button type={"link"} size={"small"} danger>封禁</Button>
                                    }
                                </div>
                                <div className={"justify-self-end flex-wrap flex gap-1 ml-3"}>
                                    {
                                        item.isHack === 1 ? <Tag color="red">封禁</Tag> :
                                            <Tag color="green">正常</Tag>
                                    }
                                    {
                                        item.VIP === 1 ? <Tag color="orange">VIP</Tag> :
                                            <Tag color="gray">普通</Tag>
                                    }
                                </div>
                                <div className={"flex-1 flex"}>
                                    <Dropdown
                                        className={"ml-auto mr-10"}
                                        menu={{ items, onClick: (e)=> {
                                            handleMenuClick({key: e.key,uid: item.UID})
                                        }}}
                                    >
                                        <Button type={"default"} icon={<MenuOutlined/>} />
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    )
                }) || <div className={"w-full h-full flex justify-center items-center"}><Empty/></div>
            }
        </div>
    )
}