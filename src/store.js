import Vue from "vue";
import Vuex from "vuex";
import { getUserInfoByOpenId } from '@/api/api'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    person: {
      "id": 0,
      "wechatid": "",
      "subscribe": 0,
      "is_friend": 0,
      "openid": "",
      "nickname": "",
      "phone": "",
      "id_number": "",
      "subscribe_time": 0,
      "access_token": "",
      "headimgurl": "",
      "result": 0
    },
    kefu: {
      "id": 0,
      "nickname": "",
      "avatar": "",
    },
    jssdk: {
      init: false
    },
    chat: {
      isLoadSuccess: false, // 是否连接及取得数据成功
    }
  },
  mutations: {
    setKefuInfo(state, info) {
      state.kefu = info;
    },
    changeJSSDKInitState(state, status) {
      state.jssdk.init = status;
    },
    changeLoadStatus(state) {
      state.chat.isLoadSuccess = !state.chat.isLoadSuccess;
    },
    removeIdCard(state) {
      state.person.id_number = "";
    },
    addIdCard(state, id) {
      state.person.id_number = id;
    },
    updateUser(state, data) {
      if (typeof data == "string") {
        const loading = Vuw.$weui.loading('加载中');
        getUserInfoByOpenId
          .then(data => {
            loading.hide();
            console.log(data)
            if (data.result === 0) {
              //未获取到用户信息，重新进行网页授权,用户被删除但本地存储有openId的情况
              window.localStorage.removeItem("openId");
              window.location.reload();
            } else {
              window.localStorage.setItem("openId", data.openid);
              state.person = data;
            }
          }).catch(err => console.log(err));
      } else {
        state.person = data;
      }
    }
  },
  actions: {}
});
