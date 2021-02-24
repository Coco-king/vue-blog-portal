<template>
  <div>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <h3 style="color: #666">用户登录</h3>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input prefix-icon="el-icon-user-solid" clearable placeholder="请输入用户名"
                      v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input prefix-icon="el-icon-lock" show-password placeholder="请输入密码" v-model="ruleForm.password"
                      clearable @keyup.enter.native="enter"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: -17%;">
            <el-button type="primary" @click="submitForm('ruleForm')">点击登录</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "Login",
  data() {
    return {
      lastTime: 0,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    enter() {
      this.submitForm('ruleForm')
    },
    login() {
      this.$axios.post('/login', this.ruleForm).then(res => {
        this.$store.commit('SET_TOKEN', res.headers.authorization)
        this.$store.commit('SET_USERINFO', res.data.data)
        this.$message.success('登陆成功')
        localStorage.setItem('activeIndex', '2')
        localStorage.setItem('showLastLogin', '1')
        this.$router.push('/blogs')
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.login()
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
        } else {
          console.log('不触发');
        }
      }
    }
  },
  components: {Header}
}
</script>

<style scoped>
.el-header, .el-footer {
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
  margin: 5% 5% 10%;
}
</style>
