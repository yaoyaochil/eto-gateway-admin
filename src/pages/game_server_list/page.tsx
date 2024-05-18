import {Button, Card, ConfigProvider, List} from "antd";

const data = [
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
];

export default function Page() {
    return (
        <div className={"p-4 w-full h-full"}>
            <div className={"w-full flex gap-2"}>
                <ConfigProvider theme={{
                    components: {
                        Button: {
                            defaultBg: "#33cb36",
                            defaultHoverBg: "#33cb36",
                            defaultColor: "#fff",
                            defaultHoverColor: "#fff",
                            defaultHoverBorderColor: "#33cb36",
                            defaultActiveBg: "#33cb36",
                            defaultActiveColor: "#fff",
                            defaultActiveBorderColor: "#33cb36",
                        }
                    }
                }}>
                    <Button type={"default"}>启动主服务</Button>
                </ConfigProvider>
                <Button type={"primary"}>创建频道</Button>
            </div>
            <div>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title}>Card content</Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}