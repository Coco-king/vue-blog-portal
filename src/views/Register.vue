<template>
  <div>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input prefix-icon="el-icon-user-solid" placeholder="请输入用户名" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="ruleForm.name" @blur="blur"></el-input>
          </el-form-item>
          <transition name="el-fade-in-linear">
            <el-form-item label="验证码" :prop="isCheck ? 'verificationCode' : ''" v-show="isCheck">
              <el-input prefix-icon="el-icon-mobile-phone" placeholder="请输入验证码" v-model="ruleForm.name"></el-input>
            </el-form-item>
          </transition>
          <el-form-item style="margin-left: -17%;">
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "Register",
  components: {Header},
  data() {
    return {
      isCheck: false,
      lastTime: 0,
      ruleForm: {
        username: '',
        password: '',
        verificationCode: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 8 到 16 个字符', trigger: 'blur'}
        ],
        verificationCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 6, max: 6, message: '验证码长度为 6 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    blur() {
      this.throttle()
    },
    toHome() {
      this.isCheck = !this.isCheck;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    throttle() {
      //获取当前时间的时间戳
      let now = new Date().valueOf();
      //第一次点击
      if (this.lastTime === 0) {
        console.log('触发事件');
        this.lastTime = now;
      } else {
        if ((now - this.lastTime) > 3000) {
          //重置上一次点击时间，2000是我自己设置的2秒间隔，根据自己的需要更改
          this.lastTime = now;
          console.log('间隔大于3秒，触发方法');
          //添加自己要调用的方法
          this.isCheck = true;
        } else {
          console.log('不触发');
        }
      }
    },
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  /*background-color: #ffffff;*/
  padding: 0;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  width: 40%;
  margin: 3em auto;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}


.demo-ruleForm {
  min-width: 100px;
  width: 80%;
  margin: 10% 5%;
}


.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
