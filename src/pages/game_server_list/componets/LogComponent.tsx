import {useEffect, useRef, useState} from 'react';
import {Button, Modal, Spin, Tag} from 'antd';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import {message} from "@/shared/EscapeAntd.tsx";
import {ReloadOutlined} from "@ant-design/icons";

interface LogPageProps {
    GCNo: number;
    title?: string;
    open: boolean;
    onCancel?: () => void;
    onOk?: () => void;
}

export default function LogPage(props: LogPageProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminal = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const [loading, setLoading] = useState(false);



    const initTerminal = () => {
        // 如果弹窗没有打开，则不进行连接
        if (!props.open) {
            return;
        }

        // 如果没有GCNo或者GCNo为0，则不进行连接
        if (!props.GCNo || props.GCNo === 0) {
            return;
        }

        // 检查是否已经连接
        if (eventSourceRef.current) {
            // 关闭连接
            eventSourceRef.current.close();
        }

        // ================== 连接日志服务 ==================·
        setLoading(true);

        // 创建一个事件源
        const eventSource = new EventSource(`/api/channel/getChannelLog?id=${props.GCNo}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
        };

        eventSource.onmessage = (e) => {
            terminal.current?.writeln(e.data);
            fitAddon.current?.fit(); // 重新计算终端大小
            setLoading(false);
        };

        eventSource.onerror = (e) => {
            message.error('日志服务连接失败');
            setLoading(false);
            console.error(e);
            eventSource.close();
        };

        if (props.open && terminalRef.current) {
            if (!terminal.current) {
                terminal.current = new Terminal({
                    disableStdin: true, // 禁止用户输入
                    theme: {
                        foreground: '#ffffff', // 字体
                        background: '#1b212f', // 背景色
                        cursor: '#ffffff', // 设置光标
                        black: '#000000',
                        brightBlack: '#808080',
                        red: '#ce2f2b',
                        brightRed: '#f44a47',
                        green: '#00b976',
                        brightGreen: '#05d289',
                        yellow: '#e0d500',
                        brightYellow: '#f4f628',
                        magenta: '#bd37bc',
                        brightMagenta: '#d86cd8',
                        blue: '#1d6fca',
                        brightBlue: '#358bed',
                        cyan: '#00a8cf',
                        brightCyan: '#19b8dd',
                        white: '#e5e5e5',
                        brightWhite: '#ffffff',
                    },
                });
                fitAddon.current = new FitAddon();
                terminal.current.loadAddon(fitAddon.current);
                terminal.current.open(terminalRef.current);
                fitAddon.current.fit();
            } else {
                terminal.current.clear();
            }
        }

        if (!props.open) {
            terminal.current?.dispose();
            terminal.current = null;
            fitAddon.current = null;
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
        }
    }

    useEffect(() => {
        initTerminal();
        return () => {
            // 组件销毁时关闭连接
            eventSourceRef.current?.close();
        }
    }, [props.open, props.GCNo]);

    return (
        <Modal
            width={"60%"}
            title={
                props.title
                ||
                <div className={'w-full leading-8'}>
                    <div className={'w-full flex'}>
                        <span>日志监听</span>
                        <div className={'ml-auto mr-10'}>
                            <Button icon={<ReloadOutlined />} type={'default'} danger onClick={() => {
                                initTerminal();
                            }}>刷新</Button>
                        </div>
                    </div>
                    <div className={'text-gray-500 text-sm'}>频道 <Tag color={'green'}>ch{props.GCNo}</Tag> 的日志   ---  长时间未更新可以重新打开或者刷新服务</div>
                </div>
            }
            open={props.open}
            onCancel={() => {
                props.onCancel && props.onCancel();
            }}
            footer={null}
        >
            <div className={"w-full h-full rounded overflow-hidden"}>
                <Spin spinning={loading} tip={
                    <div className={"mt-3"}>加载中... 请稍等</div>
                }>
                    <div ref={terminalRef} className={"w-full h-full overflow-auto"}/>
                </Spin>
            </div>
        </Modal>
    );
}