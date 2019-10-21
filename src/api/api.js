import axios from "axios";
import qs from "qs";
import VueCookies from "vue-cookies";

// let base = "http://test11111.free.idcfengye.com";
let base = "http://192.168.199.140:8500";
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
      params: { code: params.code, webchatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//2.根据openId & 微信号获取用户信息
const getUserInfoByOpenId = params => {
  return axios
    .get(`${base}/person/getUserInfoByCode`, {
      params: { openid: params.openId, webchatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//3.验证身份证号
const checkPersonIdNumber = params => {
  return axios
    .post(`${base}/person/check`, qs.stringify(params))
    .then(res => res.data);
};

//4.获取可以聊天的客服信息
const getChatableKeFuInfo = params => {
  return axios
    .get(`${base}/allocation/service`, {
      params: { openid: 'okxmVs7UtFd-FICL48v53gWvDdTc', webchatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

//4.获取jssdk配置信息
const getJSSDKConfig = params => {
  return axios
    .get(`${base}/allocation/service`, {
      params: { openid: 'okxmVs7UtFd-FICL48v53gWvDdTc', webchatid: "gh_584399a0d868" }
    })
    .then(res => res.data);
};

/**
 * 获取消息列表
 * @param messageListDto 查询条件
 * @returns {AxiosPromise}
 */
const getMessageList = messageListDto => {
  return request({
    url: "/message/list",
    method: "post",
    data: messageListDto
  });
};
/**
 * 发送图片消息
 */
const sendImage = formData => {
  return request({
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
  sendImage
};
