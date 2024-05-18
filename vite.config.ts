import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import * as http from "node:http";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:8800',
        target: 'http://192.168.110.100:8800',
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        agent: new http.Agent(), // agent: new http.Agent({ keepAlive: true })
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
