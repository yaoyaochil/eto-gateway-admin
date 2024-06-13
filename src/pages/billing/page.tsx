import {Button, Divider, Input, Pagination, Table, TableProps} from "antd";
import {TableData} from "@/pages/billing/types/table.tsx";
import {useEffect, useState} from "react";
import {deductionCera, getCeraDataList, rechargeCera} from "@/api/taiwan_billing/cera.ts";
import {message} from "@/shared/EscapeAntd.tsx";
import BillingModal from "@/pages/billing/components/modal/component.tsx";
import {formatTime} from "@/utils/format.ts";


export default function BillingPage() {
    const [account, setAccount] = useState<string>("")
    const [tableData, setTableData] = useState<TableData[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)
    const [total, setTotal] = useState<number>(0)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<"recharge" | "deduction"| "add" | undefined>(undefined)
    const [modalId, setModalId] = useState<string>("")

    const resetQuery = () => {
        setAccount("")
    }

    const getTableData = async () => {
        setLoading(true)
        const res = await getCeraDataList({account: account, page, pageSize})
        if (res.code !== 0) {
            setTableData([])
            setLoading(false)
            return
        }
        setTableData(res.data?.list || [])
        setTotal(res.data?.total || 0)
        // fetch data
        setLoading(false)
    }


    const TableColumns:TableProps<TableData>['columns'] = [
        {
            title: "创建时间",
            dataIndex: "reg_date",
            key: "reg_date",
            render: (text: string) => {
                return formatTime(text)
            }
        },
        {
            title: "玩家ID",
            dataIndex: "account",
            key: "account",
        },
        {
            title: "剩余点券",
            dataIndex: "cera",
            key: "cera",
        },
        {
            title: "最后修改时间",
            dataIndex: "mod_date",
            key: "mod_date",
            render: (text: string) => {
                return formatTime(text)
            }
        },
        {
            title: "操作",
            key: "action",
            render: (text: TableData) => (
                <span>
                <Button type="link" onClick={() => {
                    setModalType("recharge")
                    setModalId(text.account)
                    setModalVisible(true)
                }}>充值</Button>
                <Divider type="vertical"/>
                <Button type="link" danger onClick={() => {
                    setModalType("deduction")
                    setModalId(text.account)
                    setModalVisible(true)
                }}>扣减</Button>
            </span>
            ),
        },
    ]

    const onOk = async (data: { amount: number }) => {
        if (data.amount <= 0) {
            message.error("金额必须大于0")
            return
        }
        if (modalType === "recharge") {
            const res = await rechargeCera({account: modalId, cera: data.amount})
            if (res.code !== 0) {
                message.error(res.msg)
            } else {
                await getTableData()
                message.success("充值成功")
            }
        }
        if (modalType === "deduction") {
            // 扣除点券
            const res = await deductionCera({account: modalId, cera: data.amount})
            if (res.code !== 0) {
                message.error(res.msg)
            } else {
                await getTableData()
                message.success("扣除成功")
            }
        }
        setModalVisible(false)
    }


    useEffect(() => {
        getTableData()
    }, [page, pageSize]);

    return (
        <div className={"w-full p-4 flex flex-col overflow-y-scroll bg-white rounded-xl"}>
            <BillingModal id={modalId} type={modalType} open={modalVisible} onOk={onOk} onCancel={() => {setModalVisible(false)}}/>
            <div className={"flex items-center mb-3"}>
                <span>玩家账号:</span>
                <Input className={"ml-4 w-36"} value={account} placeholder={"请输入玩家ID"} onChange={(e)=>{setAccount(e.target.value)}}/>
                <Button type={"default"} className={"ml-4"} onClick={getTableData}>查询</Button>
                <Button type={"default"} className={"ml-4"} onClick={resetQuery}>重置</Button>
            </div>
            <div className={"w-full flex-1 scroll-smooth"}>
                <Table scroll={{y:400}} className={"mt-6 h-1/2"} columns={TableColumns} dataSource={tableData} rowKey={"account"} pagination={false} loading={loading}/>
            </div>
            <div className={"w-full flex justify-end mt-5"}>
                <Pagination className={"mt-4"} total={total} pageSize={pageSize}
                            pageSizeOptions={[5, 10, 20, 30, 50, 100]} showSizeChanger onChange={(page, pageSize) => {
                    setPage(page)
                    setPageSize(pageSize)
                }} showTotal={
                    (total) => `共 ${total} 条数据`
                }/>
            </div>
        </div>
    )
}