import {create} from "zustand";
import {ReactNode} from "react";


export interface RouterType {
    path: string;
    element?: string | ReactNode;
    children?: RouterType[];
    index?: boolean;
    label?: string;
    icon?: string;
}


type RouterStore = {
    router: RouterType[];
    setRouter: (router: RouterType[]) => void;
}

const routerList:RouterType[] = [
    {
        path: "/layout",
        label: "根布局",
        element: "pages/layout/page.tsx",
        children: [
            {
                index: true,
                label: "数据中心",
                path: "dashboard",
                icon: "PieChartOutlined",
                element: "pages/dashboard/page.tsx"
            },
            {
                index: false,
                label: "玩家管理",
                path: "player",
                icon: "TeamOutlined",
                element: "pages/player/page.tsx"
            },
            {
                index: false,
                label: "充值管理",
                path: "recharge",
                icon: "ShoppingCartOutlined",
                element: "pages/billing/page.tsx"
            },
            {
                index: false,
                label: "游戏邮件",
                path: "game_mail",
                icon: "MailOutlined",
                element: "pages/dashboard/page.tsx"
            },
            {
                index: false,
                label: "游戏管理",
                icon: "SettingOutlined",
                path: "game",
                children: [
                    {
                        index: false,
                        label: "游戏道具",
                        path: "game_item",
                        icon: "ClusterOutlined",
                        element: "pages/dashboard/page.tsx"
                    },
                    {
                        index: false,
                        label: "服务控制",
                        path: "game_server_manage",
                        icon: "ClusterOutlined",
                        element: "pages/service_control/page.tsx"
                    },
                    {
                        index: false,
                        label: "频道列表",
                        path: "game_server_list",
                        icon: "ClusterOutlined",
                        element: "pages/game_server_list/page.tsx"
                    },
                    {
                        index: false,
                        label: "频道创建",
                        path: "game_server_create",
                        icon: "ClusterOutlined",
                        element: "pages/dashboard/page.tsx"
                    },
                    {
                        index: false,
                        label: "Frida插件管理",
                        path: "frida_plugin",
                        icon: "ExperimentOutlined",
                        element: "pages/dashboard/page.tsx"
                    }
                ],
            }
        ]
    },
    {
        path: "/login",
        element: "pages/login/page.tsx",
    },
    {
        path: "*",
        element: "pages/404/page.tsx",
    }
]


/**
 * Store for the router
 * @param set - set the router
 * @returns
 * @constructor
 */
export const useRouterStore = create<RouterStore>((set) => {
    const router: RouterType[] = routerList;
    // const indexRoute = findIndexRouter(router);
    // if (indexRoute) {
    //     router.unshift({
    //         path: "/",
    //         // 重定向到 index: true 的路由
    //         element: <Navigate to={indexRoute} replace={true}/>,
    //     });
    // }
    return {
        router,
        setRouter: (router) => set({router}),
    };
});