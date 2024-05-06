
import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { emitter } from "./bus";

// 扩展axios请求配置
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  donNotShowLoading?: boolean;
}

// 扩展axios响应配置
interface CustomAxiosResponse extends AxiosResponse {
  donNotShowLoading?: boolean;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 6666,
});

let activeAxios: number = 0; // 当前正在请求的数量
let timer: NodeJS.Timeout; // 定时器

// 打开loading
const openLoading = () => {
  activeAxios++;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      emitter.emit("showLoading");
    }
  }, 1000);
};

// 关闭loading
const closeLoading = () => {
  activeAxios--;
  if (activeAxios <= 0) {
    clearTimeout(timer);
    emitter.emit("hideLoading");
  }
};

// 请求拦截器
const reqInterceptor: AxiosInterceptorManager<CustomAxiosRequestConfig> =
  service.interceptors.request;
reqInterceptor.use(
  (config: CustomAxiosRequestConfig) => {
    // 如果请求配置中donNotShowLoading为true，则不显示loading
    if (!config.donNotShowLoading) {
      openLoading();
    }

    const userStore = useUserStore(); // 获取用户信息

    // 请求头中添加token、用户id、请求类型
    if (config.headers) {
      if (userStore.token) {
        console.log(userStore.userInfo);
        config.headers["x-token"] = userStore.token;
        config.headers["Content-Type"] = "application/json";
        config.headers["x-user-id"] = userStore.userInfo?.ID;
      }
    }
    return config;
  },
  (error) => {
    // TODO: 关闭loading
    closeLoading();

    window.message.error(error);
    return error;
  }
);

// 响应拦截器
const resInterceptor: AxiosInterceptorManager<CustomAxiosResponse> =
  service.interceptors.response;
resInterceptor.use(
  (response: CustomAxiosResponse) => {
    // TODO: 关闭loading
    closeLoading();

    // 如果响应数据中含有new-token，则更新token
    if (response.headers["new-token"]) {
      useUserStore().setToken(response.headers["new-token"]);
    }

    // 如果响应数据的状态码为0，则表示请求成功
    if (response.data.code === 0) {
      if (response.headers.msg) {
        window.message.success(decodeURI(response.headers.msg));
      }
      return response.data;
    } else {
        window.message.error(response.data.msg);
        if (response.data.data && response.data.data.reload) {
            useUserStore().setToken("");
            useUserStore().setUserInfo({} as userInfoType);
            localStorage.clear();
            router.push({ path: "/login",replace: true });
        }
        return response.data.msg ? response.data : response
    }
  },
  (error) => {
    // TODO: 关闭loading
    closeLoading();

    if (!error.response) {
      window.message.error("网络错误");
      return;
    }

    switch (error.response.status) {
      case 401:
        useUserStore().setToken("");
        useUserStore().setUserInfo({} as userInfoType);
        window.message.error("登录过期，请重新登录");
        router.push("/login");
        break;
      case 403:
        window.message.error("没有权限");
        break;
      case 404:
        window.message.error("请求资源不存在");
        break;
      case 500:
        window.message.error("服务器错误");
        break;
      default:
        window.message.error(error.response.data.msg);
        break;
    }

    return error;
  }
);

export default service;