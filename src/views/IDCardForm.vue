<template>
  <div class="weui-form">
    <div class="weui-form__control-area">
      <div class="weui-cells__group weui-cells__group_form">
        <div class="weui-cells weui-cells_form" id="form">
          <div class="weui-cell" ref="idCardCell">
            <div class="weui-cell__hd">
              <label class="weui-label">身份证号</label>
            </div>
            <div class="weui-cell__bd">
              <input
                ref="idCard"
                class="weui-input"
                autofocus
                type="text"
                required
                placeholder="请输入正确的身份证号"
                v-model="form.idCard"
              />
              <button
                id="js_input_clear"
                class="weui-btn_reset weui-btn_icon weui-btn_input-clear"
                @click="clearIdCard"
              >
                <i class="weui-icon-clear"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="weui-form__opr-area">
      <a
        ref="submitBtn"
        class="weui-btn weui-btn_primary weui-btn_disabled"
        href="javascript:"
        @click="submitForm"
      >确定</a>
    </div>
  </div>
</template>

<script>
import idCardNoUtil from "@/utils/checkIdCard";
import api from "@/api/api";
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        idCard: ""
      }
    };
  },
  computed: mapState(['person']),
  watch: {
    "form.idCard"(val) {
      const idCardCell = this.$refs.idCardCell;
      const submitBtn = this.$refs.submitBtn;
      if (this.hasClass(idCardCell, "weui-cell_warn")) {
        this.removeClass(idCardCell, "weui-cell_warn");
      }
      if (val) {
        this.removeClass(submitBtn, "weui-btn_disabled");
      } else {
        this.addClass(submitBtn, "weui-btn_disabled");
      }
    }
  },
  methods: {
    addClass(ele, cls) {
      if (!this.hasClass(ele, cls)) {
        ele.className = ele.className == "" ? cls : ele.className + " " + cls;
      }
    },
    removeClass(elem, cls) {
      if (this.hasClass(elem, cls)) {
        var newClass = " " + elem.className.replace(/[\t\r\n]/g, "") + " ";
        while (newClass.indexOf(" " + cls + " ") >= 0) {
          newClass = newClass.replace(" " + cls + " ", " ");
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, "");
      }
    },
    hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    },
    submitForm() {
      const isIdCardValid = this.checkIdCard();
      const _this = this;
      if (isIdCardValid) {
        this.$weui.form.validate("#form", function(error) {
          if (!error) {
            var loading = _this.$weui.loading("提交中...");
            api.checkPersonIdNumber({webchatid: _this.person.webchatid, openid: _this.person.openid, id_number: _this.form.idCard}).then(data => {
              console.log(data)
              if (data) {
                loading.hide();
                _this.addIdCard(_this.form.idCard);
                _this.$weui.toast("绑定成功", 3000);
                _this.$router.push({name: "idcard"})
              } else {
                loading.hide();
                _this.$weui.toast("绑定失败", 3000);
              }
            }).catch(err => console.log(err));
          }
        });
      }
    },
    idCardChange() {
      const idCardCell = this.$refs.idCardCell;
      const submitBtn = this.$refs.submitBtn;
      if (idCardCell.hasClass("weui-cell_warn")) {
        idCardCell.removeClass("weui-cell_warn");
      }
      if (this.form.idCard) {
        submitBtn.removeClass("weui-btn_disabled");
      } else {
        submitBtn.addClass("weui-btn_disabled");
      }
    },
    checkIdCard() {
      const result = idCardNoUtil.checkIdCardNo(this.form.idCard);
      if (!result) {
        this.$weui.form.showErrorTips({
          ele: this.$refs.idCard,
          msg: "请输入正确的身份证号"
        });
      }
      return result;
    },
    clearIdCard() {
      this.form.idCard = "";
    },
    ...mapMutations(['addIdCard'])
  }
};
</script>

<style>
</style>