import {Button, Card, List, Tag} from "antd";
import {useEffect, useState} from "react";
import {getMainServiceStatus, startMainService, stopMainService} from "@/api/game_control/service_control.ts";
import {message} from "@/shared/EscapeAntd.tsx";

type ServiceInfo = {
    title: string;
    zh?: string;
    runTitle: string;
    Arg?: string;
    status: number;
}

export default function Page() {
    const [serviceInfo, setServiceInfo] = useState<ServiceInfo[]>([
        {
            title: "df_manager_r",
            zh: "管理服务",
            runTitle: "df_manager_r manager start",
            Arg: "manager",
            status: 0
        },
        {
            title: "df_stun_r",
            zh: "P2P服务",
            runTitle: "df_stun_r start",
            status: 0
        },
        {
            title: "df_relay_r",
            zh: "P2P中继服务",
            runTitle: "df_relay_r relay_200 start",
            Arg: "relay_200",
            status: 0
        },
        {
            title: "df_bridge_r",
            zh: "桥接服务",
            runTitle: "df_bridge_r bridge start",
            Arg: "bridge",
            status: 0
        },
        {
            title: "df_monitor_r",
            zh: "监控服务",
            runTitle: "df_monitor_r mnt_siroco start",
            Arg: "mnt_siroco",
            status: 0
        },
        {
            title: "df_channel_r",
            zh: "频道服务",
            runTitle: "df_channel_r channel start",
            Arg: "channel",
            status: 0
        },
        {
            title: "df_dbmw_r",
            zh: "数据库中间件服务",
            runTitle: "df_dbmw_r dbmw_gld_siroco start",
            Arg: "dbmw_gld_siroco",
            status: 0
        },
        {
            title: "df_dbmw_r",
            zh: "数据库中间件服务",
            runTitle: "df_dbmw_r dbmw_stat_siroco start",
            Arg: "dbmw_stat_siroco",
            status: 0
        },
        {
            title: "gunnersvr",
            zh: "防外挂服务",
            runTitle: "gunnersvr -t30 -i1",
            status: 0
        },
        {
            title: "secagent",
            zh: "安全服务",
            runTitle: "secagent",
            status: 0
        },
        {
            title: "df_coserver_r",
            zh: "阻止重复登录服务",
            runTitle: "df_coserver_r coserver start",
            Arg: "coserver",
            status: 0
        },
        {
            title: "df_statics_r",
            zh: "统计服务",
            runTitle: "df_statics_r stat_siroco start",
            Arg: "stat_siroco",
            status: 0
        },
        {
            title: "df_dbmw_r",
            zh: "数据库中间件服务",
            runTitle: "df_dbmw_r dbmw_mnt_siroco start",
            Arg: "dbmw_mnt_siroco",
            status: 0
        },
        {
            title: "df_guild_r",
            zh: "公会服务",
            runTitle: "df_guild_r gld_siroco start",
            Arg: "gld_siroco",
            status: 0
        },
        {
            title: "df_community_r",
            zh: "决斗场相关服务",
            runTitle: "df_community_r community start",
            Arg: "community",
            status: 0
        }
    ]) // 服务信息
    const [runService, setRunService] = useState<number>(0) // 运行中的服务数量


    // 获取服务状态
    const getServiceStatus = async () => {
        const res = await getMainServiceStatus()
        if (res.code !== 0) {
            setServiceInfo(serviceInfo.map((item) => {
                return {
                    ...item,
                    status: 0
                }
            }))
            setRunService(0)
            return
        }
        // 根据res.data中的数据 如果有对应的服务则修改对应的status
        const data = res.data
        const newServiceInfo = serviceInfo.map((item) => {
            const index = data.findIndex((d) => d === item.runTitle)
            if (index !== -1) {
                return {
                    ...item,
                    status: 1
                }
            }
            return item
        })
        setServiceInfo(newServiceInfo)
        setRunService(data.length)
    }

    // 关闭服务
    const stopService = async () => {
        const res = await stopMainService()
        if (res.code !== 0) {
            message.error("关闭服务失败")
            return
        }
        message.success("关闭服务成功")
        await getServiceStatus()
    }

    // 启动服务
    const startService = async () => {
        const res = await startMainService()
        if (res.code !== 0) {
            message.error("启动服务失败")
            return
        }
        message.success("启动服务成功")
        await getServiceStatus()
    }

    // 重启服务
    const restartService = async () => {
        const res = await stopMainService()
        if (res.code !== 0) {
            message.error("关闭服务失败")
            return
        }
        message.success("关闭服务成功")
        await getServiceStatus()

        message.info("等待5秒后启动服务")

        // 倒计时播报
        for (let i = 5; i > 0; i--) {
            message.info(`剩余${i}秒后启动服务`)
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        }

        const res2 = await startMainService()
        if (res2.code !== 0) {
            message.error("启动服务失败")
            return
        }
        message.success("启动服务成功")
        await getServiceStatus()
    }

    useEffect(() => {
        getServiceStatus()
    }, []);

    return (
        <div className={"p-4 w-full h-full flex flex-col gap-5 bg-white rounded-xl"}>
            <div className={"w-full flex gap-2"}>
                {
                    runService > 0 ? <Button type={"default"} danger onClick={stopService}>关闭服务</Button> : <Button type={"default"} onClick={startService}>启动服务</Button>
                }
                <Button type={"default"} onClick={restartService}>重启主服务</Button>
            </div>
            <div className={"overflow-y-scroll"}>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={serviceInfo}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={
                                <div className={"flex gap-2 items-center"}>
                                    <p className={"text-end leading-2 text-white"}>{item.zh ? item.zh : item.title}</p>
                                    <Tag color={item.status === 0 ? "red" : "green"}>{item.status === 0 ? "停止" : "运行"}</Tag>
                                </div>
                            }>
                                <p className={"text-xs mt-2 text-gray-400"}>服务: {item.title?item.title:"无"}</p>
                                <p className={"text-xs mt-2 text-gray-400"}>运行参数: {item.Arg?item.Arg:"无"}</p>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}