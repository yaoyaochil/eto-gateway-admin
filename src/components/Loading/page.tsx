import {Spin} from "antd";
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'
import {useEffect} from "react";  // 这个nprogress样式必须引入

export default function LoadingPage() {
    NProgress.start()

    // 组件卸载时
    useEffect(() => {
        return () => {
            NProgress.done()
        }
    }, []);



    return (
        <div className={"w-screen h-screen flex justify-center items-center"}>
            <Spin size={"large"}/>
        </div>
    )
}