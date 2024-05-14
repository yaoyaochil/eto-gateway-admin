import {Alert, Empty} from "antd";


export default function CharacterInfo() {
    return (
        <div className={"h-full flex flex-col gap-2"}>
            <Alert message="角色详情" type="info"/>
            <div className={"flex-1"}>



                {/*如果空数据*/}
                <div className={"w-full h-full flex justify-center items-center"}>
                    <Empty/>
                </div>
            </div>
        </div>
    )
}