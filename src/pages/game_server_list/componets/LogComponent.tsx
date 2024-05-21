import { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

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
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {


        if (!props.GCNo || props.GCNo === 0) {
            return;
        }
        const ws = new WebSocket(`ws://${location.host}/socket/channel/getChannelLog?id=${props.GCNo}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("连接成功");
        };

        ws.onmessage = (e) => {
            terminal.current?.writeln(e.data);
        };

        ws.onclose = () => {
            console.log("连接关闭");
        };

        ws.onerror = (e) => {
            console.error("连接错误", e);
        };

        if (props.open && terminalRef.current) {
            if (!terminal.current) {
                terminal.current = new Terminal({
                    disableStdin: true, // 禁止用户输入
                    theme: {
                        background: '#1e1e1e', // 自定义背景色
                        foreground: '#ffffff', // 自定义前景色
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
            wsRef.current?.close();
            wsRef.current = null;
        }

        return () => {
            wsRef.current?.close();
        }

    }, [props.open, props.GCNo]);

    return (
        <Modal
            width={"60%"}
            title={props.title || "频道日志"}
            open={props.open}
            onCancel={() => {
                props.onCancel && props.onCancel();
            }}
            footer={null}
        >
            <div className={"w-full h-full p-4 rounded-xl overflow-hidden"}>
                <div ref={terminalRef} className={"w-full h-full overflow-auto"}/>
            </div>
        </Modal>
    );
}
