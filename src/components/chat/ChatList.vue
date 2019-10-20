<template>
  <div v-if="chat.isLoadedSuccess">
    <section class="chatlist" :class="showSelBox>0?'chatlist-bottom-collapse':'chatlist-bottom'">
      <mt-loadmore
        :top-method="loadTop"
        top-pull-text="加载更多"
        top-drop-text="释放加载"
        @top-status-change="handleTopChange"
        ref="loadmore"
      >
        <ul>
          <template v-for="item in records">
            <div class="time" :key="item.id">
              <cite>
                <i>{{item.createdAt}}</i>
              </cite>
            </div>
            <li class="chat-mine" v-if="isOneself(item)" :key="item.id">
              <div class="chat-user">
                <img :src="person.headimgurl" />
              </div>
              <div class="chat-text" v-if="item.type === '1'" v-html="replaceFace(item.content)"></div>
              <div class="chat-text" v-else-if="item.type === '2'">
                <img :src="item.content" class="image" alt="聊天图片" />
              </div>
            </li>
            <li class="chat-else" v-else :key="item.id">
              <div class="chat-user">
                <img :src="kefu.avatar" />
              </div>
              <div class="chat-text" v-if="item.type === '1'" v-html="replaceFace(item.content)"></div>
              <div class="chat-text" v-else-if="item.type === '2'">
                <img :src="item.content" class="image" alt="聊天图片" />
              </div>
            </li>
          </template>
        </ul>
      </mt-loadmore>
    </section>

    <section class="foot">
      <mt-field id="txtContent" placeholder="请输入消息" class="con" v-model="content"></mt-field>
      <span class="btn-face" v-on:click="showSelBox=showSelBox==1?0:1">
        <span class="icon iconfont">&#xe630;</span>
      </span>
      <span class="btn-plus" v-on:click="showSelBox=showSelBox==2?0:2">
        <span class="icon iconfont">&#xe71b;</span>
      </span>
      <span class="btn btn-send weui-btn weui-btn_mini weui-btn_primary" v-on:click="sendMessage">发送</span>
      <section class="selbox" :class="showSelBox>0?'show':'hide'">
        <section v-show="showSelBox==1" class="face-box">
          <mt-swipe :auto="0" :continuous="false">
            <mt-swipe-item v-for="n in Math.ceil([...EXPS].length/18)" :key="n">
              <li v-for="(item, index) in getEXP(n,18)" :key="index">
                <img
                  :src="'emotion/'+item[1].file"
                  alt
                  :data="item[1].code"
                  v-on:click="content+=item[1].code"
                />
              </li>
            </mt-swipe-item>
          </mt-swipe>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import api from "@/api/api";
import util from "@/utils/chatUtils";
import { Toast, MessageBox, Indicator } from "mint-ui";
import { mapMutations, mapState } from "vuex";
import EventDispatcher from "@/utils/dispatch-event";
import { encode, decode } from "@/utils/codec";
import Command from "@/utils/command";
import { createPacket } from "@/utils/packet";
import EXPS from "@/constants/ExpsMap";

export default {
  name: "chatlist",
  data() {
    return {
      showSelBox: 0, // 0隐藏 1显示表情
      topStatus: "",
      user: null, // 微信用户信息
      content: "", // 输入的文本内容
      imgDataUrl: "", // 选择的图片URL

      socket: null, // socket
      eventDispatcher: null, // 事件派发器
      interval: null, // 间隔执行定时器
      isLoadedSuccess: false, // 是否加载及连接成功
      //聊天记录
      records: [
        // {
        //   type: 2,
        //   time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        //   name: "客户MM",
        //   content:
        //     '这里是<a target="_blank" href="https://github.com/taylorchen709/vue-chat">源码</a>'
        // }
      ],
      // 表情
      EXPS
    };
  },
  computed: mapState(["person", "kefu", "chat"]),
  watch: {
    isLoadedSuccess(val) {
      if (val) {
        this.scrollToBottom();
        this.focusTxtContent();
      }
    }
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
  },
  mounted() {
    // 事件派发器
    this.eventDispatcher = new EventDispatcher();
    // 监听事件
    this.listenEvent();

    const _this = this;
    if (window.WebSocket) {
      // socket
      this.socket = new WebSocket("ws://192.168.199.140:9999/chat");
      this.socket.binaryType = "arraybuffer";

      // 接收到消息
      this.socket.onmessage = function(event) {
        // 解码
        const packet = decode(event.data);
        // 不打印心跳包日志
        if (packet && packet.command !== Command.HEART_BEAT_RESPONSE) {
          // console.log(`接收到消息 ${JSON.stringify(packet)}`);
        }

        // 派发接收数据事件
        _this.eventDispatcher.dispatchEvent(packet.command, packet);
      };

      // 连接建立
      this.socket.onopen = function(event) {
        console.log(`连接建立 ${JSON.stringify(event)}`);
        // 心跳检测
        _this.heartCheck();
        // socket连接成功后，登录netty
        _this.loginNetty();
        // 获取客服信息
        _this.getkefuInfo();
        
      };

      // 连接关闭
      this.socket.onclose = function(event) {
        Indicator.close();
        _this.showErrorAlert('连接关闭');
        console.log(`连接关闭 ${JSON.stringify(event)}`);
      };

      // 连接发生错误
      this.socket.onerror = function(event) {
        Indicator.close();
        console.log(`连接错误 ${JSON.stringify(event)}`);
        _this.showErrorAlert('连接错误')
      };
    } else {
      Indicator.close();
      _this.showErrorAlert('当前浏览器不支持WebSocket')
    }

    // 刷新浏览器
    window.onbeforeunload = function() {
      if (!window.WebSocket) {
        _this.showErrorAlert('当前浏览器不支持WebSocket');
        return;
      }

      // 当websocket状态打开
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.close();
      } else {
        console.log("连接没有开启");
      }
    };
  },
  beforeDestroy() {
    // 清除定时器
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  },
  methods: {
    // 弹出错误alert
    showErrorAlert(err) {
      MessageBox.alert(err).then(action => {
        console.log(action);
        wx.closeWindow();
      });
    },
    // 获得聊天客服信息
    getkefuInfo() {
      api.getChatableKeFuInfo({ openId: this.person.openid }).then(data => {
        console.log(data);
        this.changeLoadStatus();
        Indicator.close();
      }).catch(err => {
        this.howErrorAlert(err.message)
        Indicator.close();
      });
    },
    // 事件监听
    listenEvent() {
      const _this = this;

      // 登录
      this.eventDispatcher.addListener(Command.LOGIN_RESPONSE, packet => {
        console.log("LOGIN_RESPONSE");

        if (packet.success) {
          // 当前用户信息
          _this.user = packet.user;
          console.log(`登录成功 ${JSON.stringify(packet)}`);
        }
      });

      // 消息
      this.eventDispatcher.addListener(Command.MESSAGE_RESPONSE, packet => {
        console.log("MESSAGE_RESPONSE");
        _this.records.push(
          Object.assign({}, packet, {
            time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss")
          })
        );
        console.log(_this.records);
        _this.scrollToBottom();
        console.log(`收到信息 ${JSON.stringify(packet)}`);
      });
    },
    // 发送数据包
    sendPacket(packet) {
      if (!window.WebSocket) {
        console.log("当前浏览器不支持WebSocket");
        return;
      }

      // 当websocket状态打开
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // 不打印心跳包日志
        if (packet && packet.command !== Command.HEART_BEAT_REQUEST) {
          console.log(`发送消息 ${JSON.stringify(packet)}`);
        }
        this.socket.send(encode(packet));
      } else {
        console.log("连接没有开启，发送失败");
      }
    },
    // 心跳检测
    heartCheck() {
      const _this = this;
      this.interval = window.setInterval(() => {
        // console.log(`发送心跳,${new Date().toTimeString()}`)
        _this.sendPacket(createPacket({}, Command.HEART_BEAT_REQUEST));
      }, 5000);
    },
    // 登录
    loginNetty() {
      const data = {
        username: "test1111",
        openId: this.person.openid
      };
      this.sendPacket(createPacket(data, Command.LOGIN_REQUEST));
    },
    // 发送信息
    sendMessage() {
      console.log(`发送信息:${this.content}`);
      const data = {
        content: this.content,
        type: 1,
        toUserId: this.kefu.id
      };
      this.sendPacket(createPacket(data, Command.MESSAGE_REQUEST));
      this.content = "";

      this.scrollToBottom();
      this.focusTxtContent(); //聚焦输入框
    },
    // 发送图片
    sendImage() {
      console.log(`发送图片:${this.imgDataUrl}`);
      const data = {
        content: this.imgDataUrl,
        type: 2,
        toUserId: this.kefu.id
      };
      this.sendPacket(createPacket(data, Command.MESSAGE_REQUEST));
      // 清空URL
      this.imgDataUrl = "";
    },
    // 是否是自己发送的信息
    isOneself(message) {
      console.log("0000000000000000");
      console.log(message);
      console.log(this.person.id);
      console.log(message.fromUserId === this.person.id);
      return message.fromUserId === this.person.id;
    },
    getEXP: function(pageNow, pageSize) {
      return [...this.EXPS].slice((pageNow - 1) * pageSize, pageSize * pageNow);
    },
    //发送消息
    sendMsg: function() {
      var _this = this;

      if (this.content.trim() === "") {
        Toast("请输入消息");
        return;
      }

      this.records.push({
        type: 1,
        time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        name: "游客",
        content: this.content
      });

      setTimeout(function() {
        _this.records.push({
          type: 2,
          time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
          name: "客服MM",
          content: "你好！"
        });
      }, 100);

      this.content = "";

      this.scrollToBottom();
      this.focusTxtContent(); //聚焦输入框
    },
    //聚焦输入框
    focusTxtContent: function() {
      document.querySelector("#txtContent input").focus();
    },
    //滚动条滚动到底部
    scrollToBottom: function() {
      setTimeout(function() {
        var chatlist = document.getElementsByClassName("chatlist")[0];
        chatlist.scrollTop = chatlist.scrollHeight;
      }, 100);
    },
    //替换表情代码
    replaceFace: function(con) {
      var _this = this;
      [...this.EXPS].map(([k, v]) => {
        con = con.replace(
          v.reg,
          '<img src="emotion/' + v.file + '"  alt="' + v.title + '" />'
        );
        return [k, v];
      });
      return con;
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    loadTop(id) {
      var _this = this;
      setTimeout(() => {
        var chatlist = document.getElementsByClassName("chatlist")[0];
        var oldHeight = chatlist.scrollHeight;

        _this.records.unshift(
          {
            type: 1,
            time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            name: "游客",
            content: "你好！13213"
          },
          {
            type: 2,
            time: util.formatDate.format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            name: "客户MM",
            content:
              '这里是<a target="_blank" href="https://github.com/taylorchen709/vue-chat">源码</a>13213'
          }
        );

        setTimeout(function() {
          var newHeight = chatlist.scrollHeight;
          chatlist.scrollTop = newHeight - oldHeight;
        }, 100);

        this.$refs.loadmore.onTopLoaded(id);
      }, 1500);
    },
    ...mapMutations(["changeLoadStatus"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chatlist {
  position: absolute;
  top: 60px;
  bottom: 48px;
  left: 0px;
  right: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
}

.chatlist-bottom {
  bottom: 48px;
}

.chatlist-bottom-collapse {
  bottom: 198px;
}

.chatlist ul {
  min-height: 300px;
}

.chatlist ul .chat-mine {
  text-align: right;
  padding-left: 0;
  padding-right: 60px;
}

.chatlist ul .chat-else {
  text-align: left;
  padding-right: 0;
  padding-left: 60px;
}

.chatlist ul li {
  position: relative;
  margin-bottom: 10px;
  padding-left: 60px;
  min-height: 50px;
}

.chat-mine .chat-user {
  left: auto;
  right: 3px;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  /*font-size: 14px;*/
}

.chat-user img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.time {
  top: -25px;
  width: 150px;
  display: flex;
  justify-content: center;
  margin: 5px auto;
}

cite {
  left: auto;
  right: 60px;
  text-align: right;
}

cite {
  font-style: normal;
  line-height: 24px;
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  text-align: left;
}

cite i {
  font-style: normal;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
}

.chat-mine .chat-text {
  margin-left: 0;
  text-align: left;
  background-color: #33df83;
  color: #fff;
}

.chat-text {
  position: relative;
  line-height: 22px;
  /*margin-top: 25px;*/
  padding: 10px 15px;
  background-color: #eee;
  border-radius: 3px;
  color: #333;
  word-break: break-all;
  max-width: 462px\9;
}

.chat-text,
.chat-user {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
}

.chat-text img {
  max-width: 100%;
  vertical-align: middle;
}

.chat-user {
  position: absolute;
  left: 3px;
}

.chat-text:after {
  content: "";
  position: absolute;
  left: -10px;
  top: 15px;
  width: 0;
  height: 0;
  border-style: solid dashed dashed;
  border-color: #eee transparent transparent;
  overflow: hidden;
  border-width: 10px;
}

.chat-mine .chat-text:after {
  left: auto;
  right: -10px;
  border-top-color: #33df83;
}

.foot {
  width: 100%;
  min-height: 48px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #f8f8f8;
}

.foot .con {
  position: absolute;
  left: 66px;
  right: 40px;
}

.foot .btn-plus {
  top: 10px;
  position: absolute;
  left: 5px;
}

.foot .btn-plus span {
  font-size: 20px;
}

.foot .btn-face {
  top: 10px;
  position: absolute;
  left: 35px;
}

.foot .btn-face span {
  font-size: 20px;
}

.foot .selbox {
  height: 150px;
  margin-top: 48px;
  border-top: 1px solid #d9d9d9;
}

.show {
  display: block;
}

.hide {
  display: none;
}

.face-box {
  /* position: absolute; */
  /* top: 48px; */
  /* left: 0px; */
  /* right: 0px; */
  /* bottom: 0px; */
  padding: 15px 15px 0px 15px;
  overflow: hidden;
  width: 290px;
  margin: 0px auto;
  height: 135px;
}

.face-box li {
  list-style: none;
  width: 30px;
  float: left;
  padding: 6px 10px 0px 8px;
}

.btn {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  line-height: 32px;
  margin-left: 5px;
  padding: 0 6px;
  background-color: #33df83;
  color: #fff;
  border-radius: 3px;
}

.btn-send {
  position: absolute;
  right: 0px;
  top: 8px;
}
</style>