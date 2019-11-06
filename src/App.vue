<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import api from "@/api/api";
import { mapMutations } from "vuex";
import { setToken } from "@/utils/auth";

export default {
  data() {
    return {
      id: null
    }
  },
  created() {
    console.log(222);
    // localStorage.setItem("titleName", "test");
    // window.onbeforeunload = function() {
    //   localStorage.removeItem("titleName");
    // };
    // const code = this.getUrlParams("code"),
    //   openId = window.localStorage.getItem("openId");
    // if (openId) {
    //   this.$store.commit("updateUser", openId);
    // } else if (code) {
    //   api
    //     .getUserInfoByCode({ code })
    //     .then(data => {
    //       console.log(data);
    //       this.updateUser(data);
    //       const param = { username: data.id, password: data.openid };
    //       this.getPersonInfo(param);
    //     })
    //     .catch(err => console.log(err));
    // }

    const param = { username: "4", password: "okxmVs9hw5GfjSOa-zwZAzxETbJg" };
    this.getPersonInfo(param);

    // window.addEventListener("pageshow", function(e) {
    //   // 通过persisted属性判断是否存在 BF Cache
    //   if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent) && e.persisted) {
    //     location.reload();
    //   }
    // });
  },
  methods: {
    getPersonInfo(param) {
      console.log(param)
      api
        .getTokenFromKeFu(param)
        .then(data => {
          const { data: token } = data;
          console.log(token);
          setToken(token);
          api
            .getPersonInfo()
            .then(data => {
              this.updateUser(data.data);
              this.id = data.data.id;
              console.log(this.id);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    getUrlParams(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
    ...mapMutations(["updateUser"])
  }
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
