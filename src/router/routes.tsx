// use react-router-dom to manage routes

import {createBrowserRouter, Navigate, RouteObject, useLocation} from "react-router-dom";
import {RouterType, useRouterStore} from "@/store/routerStore.tsx";
import {createComponent} from "@/utils/componentLoad.tsx";

// 获取路由
const router = useRouterStore.getState().router;


// 格式化路由
function formatRouter(router: RouterType[]): RouteObject[] {
    const routeList: RouteObject[] = [];
    router.map((item) => {
        if (item.children && item.children.length > 0) {
            const children = formatRouter(item.children);
            routeList.push({
                path: item.path,
                element: createComponent(item.element as string),
                children: children
            })
        }

        routeList.push({
            path: item.path,
            element: createComponent(item.element as string),
            index: item.index
        });
    });
    return routeList;
}

// 递归查找 index: true 的路由
export function findIndexRouter(router: RouteObject[]): string | undefined {
    for (let i = 0; i < router.length; i++) {
        if (router[i].index) {
            return router[i].path as string;
        }
        // 递归查找子路由 这里很奇怪 明明判断了children?.length 但是还是会报错 所以加了一个注释
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (router[i].children?.length && router[i].children.length > 0) {
            const childPath = findIndexRouter(router[i].children || []);
            if (childPath) {
                return `${router[i].path}/${childPath}`;
            }
        }
    }
    return undefined;
}


// 格式化后的路由
const formatRouterList = formatRouter(router) as RouteObject[];


// 重定向到 index: true 的路由
formatRouterList.push({
    path: "/",
    // 重定向到 index: true 的路由
    element: <Navigate to={findIndexRouter(formatRouterList) as string} replace={true}/>,
})

export const routes = createBrowserRouter(formatRouterList)

export const useMenuRouter = () => {
    const {pathname} = useLocation();
    // pathname.split("/").filter(Boolean); 第一个/保留
    return pathname.split("/").filter(Boolean);
}