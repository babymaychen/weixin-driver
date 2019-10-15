<template>
  <div class="aui-palace">
    <div class="weui-cells">
      <router-link :to="{ name: 'idcard'}" class="weui-cell weui-cell_access weui-cell_example">
        <div class="weui-cell__hd">
          <span class="icon iconfont">&#xe600;</span>
        </div>
        <div class="weui-cell__bd">
          <p>身份证</p>
        </div>
        <div class="weui-cell__ft" v-if="person.is_friend">已绑定</div>
        <div class="weui-cell__ft" v-else>没绑定</div>
      </router-link>
      <div class="weui-cell weui-cell_example">
        <div class="weui-cell__hd">
          <span class="icon iconfont">&#xe67d;</span>
        </div>
        <div class="weui-cell__bd">
          <p>科目</p>
        </div>
        <div class="weui-cell__ft">暂无</div>
      </div>
      <a class="weui-cell weui-cell_access weui-cell_example" href="javascript:;">
        <div class="weui-cell__hd">
          <span class="icon iconfont">&#xe615;</span>
        </div>
        <div class="weui-cell__bd">
          <p>设置</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: mapState(["person"])
};
</script>

<style lang="scss" scoped>
.aui-palace {
  height: calc(100vh - 13rem);
  padding: 0.9rem 0;
  position: relative;
  overflow: hidden;
  background: #fff;
  width: 93%;
  margin: -50px auto 1rem;
  box-shadow: 0 3px 9px #d6d6d6;
  .weui-cells {
    .weui-cell {
      padding: 5px 16px;
    }
    .iconfont {
      font-size: 1.7rem;
      color: #5463a2;
    }
    p {
      margin-left: 5px;
      text-align: left;
    }
  }
}
</style>