import {Button, Pagination, Table, TableProps, Tag} from "antd";
import {TableData} from "@/pages/game_server_list/types/table.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {getChannelList, getChannelStatusByIds, startChannel, stopChannel} from "@/api/game_control/channel_control.ts";
import {message} from "@/shared/EscapeAntd.tsx";
import {SearchOutlined} from "@ant-design/icons";
import LogPage from "@/pages/game_server_list/componets/LogComponent.tsx";

export default function Page() {
    const dataColumns:TableProps<TableData>['columns'] = [
        {
            title: "频道ID",
            dataIndex: "GCNo",
            key: "GCNo",
            width: 100,
            align: "center",
        },
        {
            title: "频道名称",
            dataIndex: "ChannelName",
            key: "ChannelName",
            width: 250,
            align: "center",
        },
        {
            title: "服务IP",
            dataIndex: "IP",
            key: "IP",
            width: 200,
            align: "center",
        },
        {
          title: "服务端口",
            dataIndex: "TCPPort",
            key: "TCPPort",
            width: 100,
            align: "center",
        },
        {
            title: "运行状态",
            dataIndex: "ChannelNo",
            key: "ChannelNo",
            width: 150,
            align: "center",
            render: (text) => (
                <div>
                    {
                        getChannelStatusByGCNo(text) ? <Tag color={"success"}>运行中</Tag> : <Tag color={"error"}>已停止</Tag>
                    }
                </div>
            )
        },
        {
            title: "操作",
            key: "action",
            width: 300,
            align: "center",
            render: (text) => (
                <div className={"flex gap-3"}>
                    <Button type={"default"} icon={<SearchOutlined/>}
                    onClick={() => {
                        setGCNo(text.ChannelNo);
                        setOpenLog(true);
                    }}
                    >查看日志</Button>
                    {
                        getChannelStatusByGCNo(text.ChannelNo) ? <Button type={"default"} danger onClick={async () => {
                            await stopChannelService(text.ChannelNo);
                        }}>关闭频道</Button> : <Button type={"default"} onClick={async ()=> {
                            await startChannelService(text.ChannelNo);
                        }}>启用频道</Button>
                    }
                    <Button type={"primary"} onClick={async ()=> {
                        await restartChannelService(text.ChannelNo);
                    }}>重启</Button>
                    {/*<Button type={"primary"}>编辑</Button>*/}
                    {/*<Button type={"primary"} danger>删除</Button>*/}
                </div>
            )
        },
    ]
    const TableFatherContainerRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<TableData[]>([]) // 数据
    const [page, setPage] = useState<number>(1); // 当前页
    const [pageSize, setPageSize] = useState<number>(5); // 每页显示条数
    const [total, setTotal] = useState<number>(0); // 总数
    const [openLog, setOpenLog] = useState<boolean>(false); // 是否打开日志
    const [GCNo, setGCNo] = useState<number>(0); // 当前要查看的频道ID
    const [channelStatus, setChannelStatus] = useState<{
        GCNo: number;
        IsRunning: boolean;
    }[]>([]); // 当前频道状态
    const [tableHeight, setTableHeight] = useState<number>(0); // 表格高度


    const getStatus = async (ids:number[]) => {
        const res = await getChannelStatusByIds({ids: ids});
        if (res.code === 0) {
            setChannelStatus(res.data);
            return
        }
        return
    }

    // 根据频道ID从channelStatus中获取状态
    const getChannelStatusByGCNo = (GCNo: number) => {
        if (channelStatus.length === 0) {
            return false;
        }
        const item = channelStatus.find((item) => item.GCNo === GCNo);
        return item ? item.IsRunning : false;
    }


    const getChannelListData = useCallback(async () => {
        const res = await getChannelList({page: page, pageSize: pageSize});
        if (res.code === 0) {
            setTotal(res.data.total);
            setData(res.data.list);

            // 获取频道状态
            const ids = res.data.list.map((item) => item.ChannelNo);
            await getStatus(ids);
            return
        }
        message.error(res.msg);
    }, [page, pageSize])

    const startChannelService = async (GCNo: number) => {
        const res = await startChannel({GCNo: GCNo});
        if (res.code === 0) {
            message.success("启动成功");
            await getChannelListData();
            return
        }
        message.error(res.msg);
    }

    const stopChannelService = async (GCNo: number) => {
        const res = await stopChannel({GCNo: GCNo});
        if (res.code === 0) {
            message.success("关闭成功");
            await getChannelListData();
            return
        }
        message.error(res.msg);
    }

    const restartChannelService = async (GCNo: number) => {
        // 先关闭 然后 3秒后启动 期间不允许操作 倒计时播报
        await stopChannelService(GCNo);

        // 倒计时播报
        for (let i = 3; i > 0; i--) {
            message.info(`剩余${i}秒后启动服务`)
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        }

        await startChannelService(GCNo);
    }

    const handleCloseLog = () => {
        setOpenLog(false);
        setGCNo(0);
    }

    const handleResize = () => {
        if (TableFatherContainerRef.current) {
            setTableHeight(TableFatherContainerRef.current.clientHeight - 32); // 32 是大致的 padding 和 margin 的高度
        }
    };

    useEffect(() => {
        // fetch data
        function fetchData() {
            getChannelListData();
        }
        fetchData();
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [getChannelListData]);

    return (
        <div className={"p-4 w-full h-full flex flex-col gap-4 bg-white rounded-xl"}>
            <div className={"w-full flex gap-2"}>
                <Button type={"primary"} onClick={()=>{
                    message.warning("暂未开放")
                }}>创建频道</Button>
            </div>
            <div className={"flex flex-col w-full h-full overflow-hidden"}>
                <div className={"overflow-hidden flex-1 w-full"} ref={TableFatherContainerRef}>
                    <Table scroll={{y:tableHeight}} dataSource={data} columns={dataColumns} pagination={false} rowKey={record => record.GCNo} />
                </div>
                <div className={"mt-4 flex justify-end"}>
                    <Pagination pageSize={pageSize} total={total} current={page} showTotal={
                        (total) => `共 ${total} 条数据`
                    } showSizeChanger pageSizeOptions={[5, 10, 20, 30, 50, 100]
                    } onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }} />
                </div>
            </div>
            <LogPage open={openLog} GCNo={GCNo} onCancel={handleCloseLog} />
        </div>
    )
}