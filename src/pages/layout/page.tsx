import {useEffect, useState} from 'react';
import {
    GithubOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, theme} from 'antd';
import SystemLogoIcon from "@/components/SystemLogoIcon/Icon.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import MenuComponent from "@/components/Layout/Menu/Component.tsx";
import useUserStore from "@/store/userStore.ts";
import {message} from "@/shared/EscapeAntd.tsx";


const { Header, Sider, Content,Footer } = Layout;

export default function LayoutPage() {
    const [collapsed, setCollapsed] = useState(false);
    const token = useUserStore().getState().token;
    const router = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    useEffect(() => {
        if (token === "") {
            message.error('无权限访问');
            router('/login');
        }
        // ================== 侧边栏折叠 ==================
        const handleResize = () => {
            if (window.innerWidth < 720) {
                setCollapsed(true);
                return
            }
            if (window.innerWidth >= 720) {
                setCollapsed(false);
                return
            }
        }
        // ================== 监听窗口变化 ==================
        window.addEventListener('resize', handleResize);

        return () => {
            // ================== 移除事件监听 ==================
            window.removeEventListener('resize', handleResize);
        }

    }, [router, token]);

    return (
        <Layout style={{
            height: '100vh',
            minWidth: '1280px',
            minHeight: '720px',
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
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
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
                    <div className={"h-full w-full flex flex-col"}>
                        <Outlet/>
                    </div>
                </Content>
                <div className={"flex justify-center items-center mt-auto mb-3"}>
                    <span className={"text-sm text-gray-400"}>© 2024 Eto</span>
                    <span className={"text-sm text-gray-400 ml-1 mr-1"}>All Rights Reserved</span>
                    <a href="https://github.com/yaoyaochil/eto-gateway" target="_blank" rel="noreferrer">
                        <GithubOutlined className={"text-gray-400"}/>
                        <span className={"text-sm text-gray-400 ml-1"}>Github @yaoyaochil</span>
                    </a>
                </div>
            </Layout>
        </Layout>
    );
}