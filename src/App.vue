<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import api from "@/api/api";
import { mapMutations } from "vuex";
export default {
  created() {
    // const code = this.getUrlParams("code"),
    //   openId = window.localStorage.getItem("openId");
    // if (openId) {
    //   this.$store.commit("updateUser", openId);
    // } else if (code) {
    //   api.getUserInfoByCode({code})
    //     .then(data => {
    //       console.log(data)
    //       this.updateUser(data)
    //     })
    //     .catch(err => console.log(err));
    // }
    // window.addEventListener("pageshow", function(e) {
    //   // 通过persisted属性判断是否存在 BF Cache
    //   if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent) && e.persisted) {
    //     location.reload();
    //   }
    // });
  },
  methods: {
    getUrlParams(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
    ...mapMutations(['updateUser'])
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
