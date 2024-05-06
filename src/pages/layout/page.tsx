import {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, theme} from 'antd';
import SystemLogoIcon from "@/components/SystemLogoIcon/Icon.tsx";
import {Outlet} from "react-router-dom";
import MenuComponent from "@/components/Layout/Menu/Component.tsx";


const { Header, Sider, Content } = Layout;

export default function LayoutPage() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{
            height: '100vh',
            overflow: 'hidden',
        }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="h-16 w-full p-10 flex flex-col justify-center items-center">
                    <div className={`flex items-center ${collapsed?"rounded transition-all duration-200":"rounded transition-all duration-200"}`}>
                        <SystemLogoIcon className="w-9 h-9"/>
                        <span className={`transition-opacity duration-300 ${collapsed?"w-0 opacity-0":"opacity-100 text-white font-bold ml-2 flex-nowrap delay-200"}`}>Eto 网关</span>
                    </div>
                </div>
                <MenuComponent />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}