<template>
  <section class="top">
    <img class="head" :src="kefu.avatar" />
    <span class="name">客服 -- {{kefu.nickname}}</span>
    <!--fa fa-volume-off-->
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "heads",
  computed: mapState(["kefu"])
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #419e44;
  padding: 5px 10px;
}

.top .head {
  width: 40px;
  height: 40px;
  float: left;
  border-radius: 100%;
}

.top .name {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  font-family: auto;
  display: flex;
  padding-left: 10px;
}

.top .voice {
  width: 30px;
  height: 50px;
  float: right;
  text-align: center;
}
</style>