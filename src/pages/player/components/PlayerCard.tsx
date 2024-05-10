import {Button, Empty, Tag} from "antd";
import {CopyOutlined} from "@ant-design/icons";
import {message} from "@/shared/EscapeAntd.tsx";
import {DTaiwanAccountInfo} from "@/shared/response/DTaiwanAccountInfo.ts";


type PlayerCardProps = {
    data: DTaiwanAccountInfo[];
}

export default function PlayerCardComponent(props: PlayerCardProps) {
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
                            <div
                                className={"cursor-pointer border-2 w-full rounded-xl scale-95 hover:scale-100 hover:border-blue-500 hover:border-4  transition-all duration-200"}
                                key={index}>
                                <div className={" h-16 flex items-center justify-start pl-3 gap-2"}>
                                    {/*<Avatar size={40} src={<SystemLogoIcon className="w-10 h-10 bg-black"/>}/>*/}
                                    <div className={"flex flex-col"}>
                        <span className={"flex items-center justify-start w-28 leading-6"}>
                            <span className={"whitespace-nowrap font-bold"}>UID：</span>
                            <span className={"whitespace-nowrap"}>
                                {/*自动补齐为8位显示*/}
                                {item.UID.toString().padStart(8, '0')}
                            </span>
                            <Button icon={<CopyOutlined/>} size={"small"} type={"link"} className={"ml-1"}
                                    onClick={() => copyToClipboard(String(item.UID))}/>
                        </span>
                                        <span className={"flex items-center overflow-ellipsis justify-start leading-6"}>
                            <span className={"whitespace-nowrap font-bold text-orange-400"}>用户名：</span>
                            <span className={"whitespace-nowrap"}>{item.accountname}</span>
                        </span>
                                    </div>
                                    <div className={"grid grid-rows-2 ml-3"}>
                                        <Button type={"link"} size={"small"}>查看</Button>
                                        {
                                            item.isHack === 1 ? <Button type={"link"} size={"small"}>解封</Button> :
                                                <Button type={"link"} size={"small"} danger>封禁</Button>
                                        }
                                    </div>
                                    <div className={"justify-self-end flex-wrap flex gap-1"}>
                                        {
                                            item.isHack === 1 ? <Tag color="red">封禁</Tag> :
                                                <Tag color="green">正常</Tag>
                                        }
                                        {
                                            item.VIP === 1 ? <Tag color="orange">VIP</Tag> :
                                                <Tag color="gray">普通</Tag>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }) || <div className={"w-full h-full flex justify-center items-center"}><Empty /></div>
                }
            </div>
    )
}