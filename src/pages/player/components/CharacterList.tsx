import {Alert, Empty, Pagination} from "antd";
import {TaiwanCainCharacterInfo} from "@/shared/response/TaiwanCain.ts";
import {useCallback, useEffect, useState} from "react";
import {getCharacterList} from "@/api/taiwan_cain/character.ts";
import {message} from "@/shared/EscapeAntd.tsx";
import {jobDict} from "@/shared/dict/character.ts";

type PropsType = {
    m_id: number;
}

export default function CharacterList(props:PropsType) {
    const [characterList, setCharacterList] = useState<TaiwanCainCharacterInfo[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    // 根据jobDict转换职业
    const getJob = (job: number) => {
        // 从jobDict中找到对应的职业
        const jobInfo = jobDict.find(item => item.job === job);
        if (jobInfo) {
            return jobInfo.name
        }
        return "未知职业"
    }

    // 根据jobDict转换转职
    const getGrow = (job: number, grow: number) => {
        // 从jobDict中找到对应的职业
        const jobInfo = jobDict.find(item => item.job === job);
        if (jobInfo) {
            const growInfo = jobInfo.grow.find(item => item.grow_type === grow);
            if (growInfo) {
                return growInfo.name
            }
        }
        return "未转职"
    }

    const getCharacter = useCallback(async () => {
        const res = await getCharacterList({m_id: props.m_id, page: page, pageSize: pageSize});
        if (res.code === 0) {
            setCharacterList(res.data.list)
            setTotal(res.data.total)
            message.success("获取角色成功")
        } else {
            message.error(res.msg)
        }
    }, [page, pageSize, props.m_id]);

    useEffect(() => {
        if (props.m_id !== 0) {
            getCharacter()
        }
    }, [props.m_id]);

    return (
        <div className={"h-full flex flex-col gap-2 overflow-hidden"}>
            <Alert message="角色列表" type="info"/>
            <div className={"mt-4 flex-1 overflow-auto gap-4 flex-col flex"}>
                {
                    // 如果有数据
                    characterList.length > 0 && characterList.map((item, index) => {
                        return (
                            <div
                                className={"w-full h-16 p-3 border-2 rounded-xl flex items-center gap-5 scale-95 hover:scale-100 cursor-pointer duration-200 transition-all hover:border-blue-500"}
                                key={index}>
                                <div className={"grid-rows-2 w-24 truncate"}>
                                    <div>
                                        <span className={"text-xs"}>昵称：</span>
                                        <span className={"text-xs"}>{item.charac_name}</span>
                                    </div>
                                    <div>
                                        <span className={"text-xs"}>等级：</span>
                                        <span className={"text-xs"}>{item.lev}</span>
                                    </div>
                                </div>
                                <div className={"grid-rows-2"}>
                                    <div>
                                        <span className={"text-xs"}>职业：</span>
                                        <span className={"text-xs"}>{getJob(item.job)}</span>
                                    </div>
                                    <div>
                                        <span className={"text-xs"}>转职：</span>
                                        <span className={"text-xs"}>{getGrow(item.job,item.grow_type)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) ||
                    <div className={"w-full h-full flex justify-center items-center"}>
                        <Empty/>
                    </div>
                }
            </div>
            <div className={"w-full flex justify-end"}>
                <Pagination current={page} total={total} pageSize={pageSize} onChange={(page, pageSize) => {
                    setPage(page)
                    setPageSize(pageSize)
                }}/>
            </div>
        </div>
    )
}