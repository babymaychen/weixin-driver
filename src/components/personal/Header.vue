<template>
  <div class="aui-head-user">
    <div class="aui-flex">
      <div class="aui-user-img">
        <img :src="person.headimgurl" alt />
      </div>
      <div class="aui-flex-box">
        <h2>{{person.nickname}}</h2>
        <h3>已实名</h3>
      </div>
      <div class="aui-arrow">
        <p>个人主页</p>
      </div>
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
.aui-head-user {
  padding-top: 1rem;
  position: relative;
  width: 100%;
  background: linear-gradient(
      217deg,
      rgba(11, 82, 42, 0.8),
      rgba(11, 82, 42, 0) 70.71%
    ),
    linear-gradient(127deg, rgba(25, 147, 78, 1), rgba(25, 147, 78, 0) 70.71%),
    linear-gradient(
      336deg,
      rgba(65, 199, 175, 0.8),
      rgba(65, 199, 175, 0) 70.71%
    );
  height: 11rem;
  .aui-flex {
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    position: relative;
    .aui-flex-box {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      color: #333;
      & h2 {
        text-align: left;
        font-weight: normal;
        color: #000000;
        margin-bottom: 0.3rem;
      }
      & h3 {
        background: #393a43;
        border-radius: 20px;
        color: #bdbec2;
        font-weight: normal;
        font-size: 0.8rem;
        padding: 0.1rem 0.3rem;
        width: 3.5rem;
        text-align: center;
        margin: 0;
      }
    }
    .aui-user-img {
      width: 60px;
      height: 60px;
      border: 2px solid #fff;
      border-radius: 50%;
      margin-right: 1rem;
      & img {
        width: 60px;
        height: 60px;
        display: block;
        border: none;
        border-radius: 100%;
      }
    }
    .aui-arrow {
      background-image: linear-gradient(to right, #c19c7e, #d4bdad);
      background-color: #c19c7e;
      color: #0b0000;
      position: relative;
      border-radius: 20px 0 0 20px;
      font-size: 0.9rem;
      padding: 0.2rem 1rem 0.2rem 0.8rem;
      margin-right: -15px;
      p {
        margin: 0;
      }
      &::after {
        content: " ";
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 2px 2px 0 0;
        border-color: #2e1b15;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: relative;
        top: -2px;
        position: absolute;
        top: 50%;
        margin-top: -4px;
        right: 8px;
        border-radius: 1px;
      }
    }
  }
}
</style>