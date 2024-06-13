

export interface MailRequest {
    charNo: number; // 接收者角色ID
    sendCharName: string; // 发送者名称
    letterText: string; // 信件内容
    item_id: number; // 物品ID
    add_info: number; // 物品数量
    seal_flag: number; // 是否封印 0未封印 1封印
    seperate_upgrade: number; // 锻造等级
    upgrade: number; // 强化/增幅数值
    amplify_option: number; // 红字属性类型 1体力 2精神 3力量 4智力 0无
    gold: number; // 金币
}