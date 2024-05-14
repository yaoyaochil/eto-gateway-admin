import {Input, Modal} from "antd";
import {useState} from "react";

interface BillingModalProps {
    id?: string;
    type ?: "recharge" | "deduction"| "add";
    open: boolean;
    onCancel?: () => void;
    onOk?: (data:{amount: number}) => void;
}

export default function BillingModal(props:BillingModalProps) {

    const [amount, setAmount] = useState<number>(0) // 充值金额

    return (
        <Modal
            title={"点券操作"}
            open={props.open}
            okText={props.type === "recharge" ? "充值" : "扣除"}
            onCancel={()=> {
                setAmount(0)
                props.onCancel && props.onCancel()
            }}
            onOk={props.onOk && (() => {
                props.onOk && props.onOk({amount})
                setAmount(0)
            })}
        >
            <div className={"w-full h-full p-3"}>
                <div className={"flex items-center mt-3"}>
                    <span className={"w-16 text-end"}>玩家ID:</span>
                    <Input className={"ml-4 w-36"} disabled value={props.id} placeholder={"未匹配ID"}/>
                </div>
                <div className={"flex items-center mt-4"}>
                    <span className={"w-16 text-end"}>
                        {props.type === "recharge" ? "充值金额" : "扣除金额"}
                    </span>
                    <Input type={"number"} className={"ml-4 w-36"} placeholder={
                        props.type === "recharge" ? "请输入充值金额" : "请输入扣除金额"
                    } value={amount} onChange={
                        (e) => {
                            setAmount(Number(e.target.value))
                        }
                    }/>
                </div>
            </div>
        </Modal>
    )
}