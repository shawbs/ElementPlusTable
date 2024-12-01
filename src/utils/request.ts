import axios, {
    type InternalAxiosRequestConfig,
    type AxiosResponse,
  } from "axios";
  import qs from "qs";
  import { ElMessage } from 'element-plus'
  // 创建 axios 实例
  const service = axios.create({
    baseURL: '',
    timeout: 50000,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
  
  // 请求拦截器
  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accessToken = "123";

  
      config.headers["Authorization"] = accessToken;
  
      if (
        config.headers["Content-Type"] &&
        (config.headers["Content-Type"] as string).includes(
          "application/x-www-form-urlencoded"
        )
      ) {
        config.data = qs.stringify(config.data);
      }
  
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
      if (
        response.config.responseType === "blob" ||
        response.config.responseType === "arraybuffer"
      ) {
        return response;
      }
  
      let resdata = response.data;
  
      if (typeof response.data.code === "undefined") {
        resdata = {
          data: response.data,
          code: 0,
          msg: "",
        };
      }
  
      const { code, data, msg } = resdata;
      if (code === 200) {
        return data;
      }
  
      ElMessage.error(msg || "系统出错");
      return Promise.reject(new Error(msg || "Error"));
    },
    (error: any) => {
      // 异常处理
      if (error.response?.data) {
        const { code, msg } = error.response.data;
        if (
          
          [401, 424].includes(error.status)
        ) {
          ElMessage.error(msg || "系统出错");
        } else {
          ElMessage.error(msg || "系统出错");
        }
      }
      return Promise.reject(error.message);
    }
  );
  
  // 导出 axios 实例
  export default service;
  
  export const exportHandle = (option: any) => {
    service({ ...option, responseType: "blob" }).then((response) => {
      const fileData = response.data;
      const fileName = response.headers["content-disposition"]
        ? decodeURI(
            response.headers["content-disposition"].split(";")[1].split("=")[1]
          )
        : "download.xlsx";
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
  
      const blob = new Blob([fileData], { type: fileType });
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
  
      document.body.appendChild(downloadLink);
      downloadLink.click();
  
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(downloadUrl);
    });
  };
  