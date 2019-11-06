import axios from "axios";
import qs from "qs";
import { getToken } from '@/utils/auth'

// let base = "http://test11111.free.idcfengye.com";
let base = "http://127.0.0.1:8080";
// let base = "http://bkswxsdk.114wbn.com";

// 创建axios实例
const service = axios.create({
  baseURL: base,
  withCredentials: false,
  timeout: 5000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  const method = config.method.toLocaleLowerCase()
  if (method === 'get' && config.data) {
    config.url += '?' + Qs.stringify(config.data)
  }
  return config
}, error => {
  console.log(`请求错误=${JSON.stringify(error)}`)
  return Promise.reject(error)
})




// http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     // if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//     if (VueCookies.get("token")) {
//       config.headers.Authorization = `token ${VueCookies.get("token")}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );

// http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     switch (response.data.code) {
//       case 10004:
//         //重新获取token
//         this.$cookies.remove("token"); //清除token
//         localStorage.removeItem("perInfo"); //清除个人信息
//       default:
//         return response;
//     }
//   },
//   error => {
//     // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//     return Promise.reject("请求接口异常"); // 返回接口返回的错误信息
//   }
// );

//1.根据code获取用户信息
const getUserInfoByCode = params => {
  return axios
    .get(`${base}/person/authcode`, {
      params: { code: params.code, wechatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//2.根据openId & 微信号获取用户信息
const getUserInfoByOpenId = params => {
  return axios
    .get(`${base}/person/getUserInfoByCode`, {
      params: { openid: params.openId, wechatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//3.验证身份证号
const checkPersonIdNumber = params => {
  return axios
    .post(`${base}/person/check`, qs.stringify(params))
    // .post(`${base}/person/check`, qs.stringify(params))
    .then(res => res.data);

};

//4.获取可以聊天的客服信息
const getChatableKeFuInfo = params => {
  return service({
    url: base + '/allocation/service',
    method: 'get',
    params: { openid: params.openId, wechatid: "gh_584399a0d868" }
  }).then(res => res.data);
};

//4.获取jssdk配置信息
const getJSSDKConfig = params => {
  return axios
    .get(`${base}/allocation/service`, {
      params: { openid: 'okxmVs7UtFd-FICL48v53gWvDdTc', wechatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//5.向客服后端获取token
const getTokenFromKeFu = params => {
  return axios.post(`http://localhost:8080/auth/visitor`, params).then(res => res.data);
}
//6.获取当前用户的信息
const getPersonInfo = params => {
  return service({
    url: base + '/visitor/info',
    method: 'get'
  }).then(res => res.data);
}

/**
 * 获取消息列表
 * @param messageListDto 查询条件
 * @returns {AxiosPromise}
 */
const getMessageList = messageListDto => {
  return service({
    url: "/message/list",
    method: "post",
    data: messageListDto
  });
};
/**
 * 发送图片消息
 */
const sendImage = formData => {
  return service({
    url: "/image/uploadFile",
    method: "post",
    params: { imageType: "chatpicture" },
    data: formData
  });
};

export default {
  getUserInfoByCode,
  getUserInfoByOpenId,
  checkPersonIdNumber,
  getChatableKeFuInfo,
  getMessageList,
  getJSSDKConfig,
  getTokenFromKeFu,
  getPersonInfo,
  sendImage
};
