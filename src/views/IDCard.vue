<template>
  <div class="IDCard">
    <div class="card already-add" v-if="person.id_number">
      <div class="title">
        <div class="left">
          <span class="icon iconfont">&#xe600;</span>
          <span class="text">身份证</span>
        </div>
        <div class="right">
          <span class="text" @click="disconnect">解绑</span>
        </div>
        <div class="clearboth"></div>
      </div>
      <div class="text-left">
        <span>{{person.id_number}}</span>
      </div>
    </div>
    <div class="card not-add" v-else>
      <router-link :to="{ name: 'idcardForm'}" class="center">
        <div class="weui-btn plusContainer">
          <span class="icon iconfont">&#xe610;</span>
        </div>
        <span class="addText">添加身份证</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: [],
  data() {
    return {};
  },
  computed: mapState(['person']),
  methods: {
    disconnect() {
      this.$weui.dialog({
        title: "提示",
        content: "是否确定解绑身份证",
        buttons: [
          {
            label: "取消",
            type: "default",
            onClick: () => {}
          },
          {
            label: "确定",
            type: "primary",
            onClick: () => {
              this.removeIdCard();
              this.$weui.toast("解绑成功", 3000);
            }
          }
        ]
      });
    },
    ...mapMutations(['removeIdCard'])
  }
};
</script>

<style lang="scss" scoped>
.IDCard {
  .card {
    margin: 10px auto 1rem;
    padding: 0.9rem 0;
    position: relative;
    overflow: hidden;
    width: 93%;
    height: 10rem;
    border-radius: 5px;
    .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      .addText {
        color: #000;
        margin-top: 0.5rem;
        font-size: 0.8rem;
      }
      .plusContainer {
        background: #419e44;
        width: 50px;
        height: 50px;
        border: 1px solid #419e44;
        border-radius: 50%;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 3px 9px #419e44;
        .iconfont {
          font-size: 1.8rem;
        }
      }
    }
  }
  .not-add {
    background: #fff;
    box-shadow: 0 3px 9px #d6d6d6;
  }
  .already-add {
    background: linear-gradient(to right, #419e44, #6de195);
    box-shadow: 0 3px 9px #419e44;
    .title {
      margin: 2px 10px;
      .left {
        float: left;
        color: #fbfbfb;
        .iconfont {
          font-size: 1.8rem;
        }
        .text {
          vertical-align: super;
        }
      }
      .right {
        float: right;
        .text {
          font-size: 1.2rem;
          vertical-align: text-top;
          color: #fbfbfb;
        }
      }
      .clearboth {
        clear: both;
      }
    }
    .text-left {
      margin: 20px 10px;
      position: absolute;
      bottom: 10px;
      font-weight: bold;
      font-size: 1.8rem;
      color: #fbfbfb;
      text-align: left;
    }
  }
}
</style>