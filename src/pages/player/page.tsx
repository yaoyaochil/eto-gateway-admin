import {Alert, Button, Input, Pagination, PaginationProps, Select} from "antd";
import PlayerCardComponent from "@/pages/player/components/PlayerCard.tsx";
import {SearchOutlined} from "@ant-design/icons";
import {useCallback, useEffect, useState} from "react";
import {DTaiwanAccountInfo} from "@/shared/response/DTaiwanAccountInfo.ts";
import {getDTaiwanAccountList} from "@/api/d_taiwan/account.ts";
import CharacterList from "@/pages/player/components/CharacterList.tsx";
import CharacterInfo from "@/pages/player/components/CharacterInfo.tsx";


export default function PlayerPage() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(7);
    const [total, setTotal] = useState<number>(0);
    const [playerList, setPlayerList] = useState<DTaiwanAccountInfo[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [searchType, setSearchType] = useState<string>("2");

    const getAccountList = useCallback(async () => {
        const res = await getDTaiwanAccountList({page: page, pageSize: pageSize, UID: searchType === "1" ? Number(searchValue) : 0, accountname: searchType === "2" ? searchValue : ""});
        if (res.code === 0) {
            setPlayerList(res.data.list)
            setTotal(res.data.total)
        }
        setLoading(false);
    }, [page, pageSize, searchType, searchValue]);

    // 分页
    const onPageChange: PaginationProps['onChange'] = async (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
    }

    // 手动查询
    const handleClick = () => {
        setLoading(true);
        getAccountList()
    }

    useEffect(() => {
        getAccountList()
    }, [page, pageSize, getAccountList]);

    return (
        <div className={"w-full h-full transition-all duration-300 flex gap-4"}>
            <div
                className={"h-full lg:w-64 sm:w-4/12 min-w-96 border-2 rounded-xl p-5 overflow-hidden flex flex-col gap-5"}>
                <Alert message="玩家列表" type="info"/>
                <div className={"flex-1 w-full flex flex-col gap-3 overflow-hidden"}>
                    <div className={"px-3 flex gap-2 pt-2 w-full"}>
                        <Select className={"w-48"} placeholder={"查询类型"} value={searchType} onChange={(e)=> setSearchType(e)}>
                            <Select.Option value="1">UID</Select.Option>
                            <Select.Option value="2">账号</Select.Option>
                        </Select>
                        <Input value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} />
                        <Button loading={loading} type={"default"} icon={<SearchOutlined/>} onClick={handleClick}>
                            查询
                        </Button>
                    </div>
                    <PlayerCardComponent data={playerList}/>
                </div>
                <div className={"w-full flex justify-end"}>
                    <Pagination pageSize={pageSize} current={page} total={total} onChange={onPageChange} showTotal={
                        (total) => {
                            return `共 ${total} 条`
                        }
                    }  pageSizeOptions={[7,14,50,100]} showSizeChanger className={"ml-auto"}/>
                </div>
            </div>
            <div className={"flex-1 min-w-96 border-2 rounded-xl p-4 grid grid-cols-2 gap-4"}>
                <div className={"col-span-1 border-2 rounded-xl hover:border-blue-400 p-3 transition-all duration-300"}>
                    <CharacterList/>
                </div>
                <div className={"col-span-1 border-2 rounded-xl hover:border-blue-400 p-3 transition-all duration-300"}>
                    <CharacterInfo/>
                </div>
            </div>
        </div>
    );
}