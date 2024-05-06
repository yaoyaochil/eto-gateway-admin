import * as AntdIcon from '@ant-design/icons';
import {lazy, ReactNode, Suspense} from "react";


export function createIcon(icon: string | undefined): ReactNode{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (icon && AntdIcon[icon]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const Icon = AntdIcon[icon];
        return <Icon />;
    }
    return null;
}


export function createComponent(component_path: string | undefined): ReactNode{
    // 使用动态import加载组件
    if (component_path) {
        const Component = lazy(() => import(`../${component_path}`));
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Component />
            </Suspense>
        )
    }
    return null;
}