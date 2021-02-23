<template>
  <div class="">
    <!--    <h3>欢迎来到南浔博客</h3>
    <div class="block">
      <el-avatar :size="50" :src="user.avatar"></el-avatar>
    </div>
    <b>{{ user.username }}</b>
    <div style="margin: 10px 0">
      <span><el-link type="primary">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success">发布文章</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin"><el-link href="/login" type="warning">登录</el-link></span>
      <span v-show="hasLogin"><el-link @click="loginOut" type="danger">退出</el-link></span>
    </div>-->
    <el-card style="height: 60px;" :body-style="{ padding: '0' }">
      <el-image
          src="https://s3.ax1x.com/2021/02/23/yqNJud.png"
          class="logo" fit="scale-down " alt="竹隐寒烟" @click="toHome">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>

      <div class="v-right">
        <el-menu :default-active="activeIndex" class="el-menu-demo"
                 mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">
            <el-avatar :size="40" :src="user.avatar"></el-avatar>
          </el-menu-item>
          <!--          <el-submenu index="2">
                      <template slot="title">我的工作台</template>
                      <el-menu-item index="2-1">选项1</el-menu-item>
                      <el-menu-item index="2-2">选项2</el-menu-item>
                      <el-menu-item index="2-3">选项3</el-menu-item>
                      <el-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <el-menu-item index="2-4-1">选项1</el-menu-item>
                        <el-menu-item index="2-4-2">选项2</el-menu-item>
                        <el-menu-item index="2-4-3">选项3</el-menu-item>
                      </el-submenu>
                    </el-submenu>-->
          <el-menu-item index="2">主页</el-menu-item>
          <el-menu-item route index="3">发布文章</el-menu-item>
          <el-menu-item v-show="!hasLogin" index="4">登录</el-menu-item>
          <el-menu-item v-show="hasLogin" index="4">退出</el-menu-item>
        </el-menu>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      hasLogin: false,
      activeIndex: localStorage.getItem('activeIndex') || '2',
      user: {
        username: '请先登录',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',

      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      const number = Number.parseInt(key);
      if (number === 1) {
        localStorage.setItem('activeIndex', '1')
      } else if (number === 2) {
        this.toHome()
      } else if (number === 3) {
        localStorage.setItem('activeIndex', '3')
        this.$router.push('/blog/add')
      } else if (number === 4 && !this.hasLogin) {
        localStorage.setItem('activeIndex', '4')
        this.$router.push('/login')
      } else if (number === 4 && this.hasLogin) {
        localStorage.setItem('activeIndex', '2')
        this.activeIndex = '2'
        this.logOut()
      }
    },
    toHome() {
      localStorage.setItem('activeIndex', '2')
      this.$router.push('/blogs')
    },
    logOut() {
      this.$axios.get('/logout', {
        headers: {
          'Authorization': localStorage.getItem('token') || 'null'
        }
      }).then(res => {
        this.$store.commit('REMOVE_INFO')
        this.$message.success('已退出登录')
        this.user = {}
        this.hasLogin = false
        this.$router.push('/blogs')
      })
    }
  },
  created() {
    let user = sessionStorage.getItem('userInfo');
    if (user) {
      this.hasLogin = true
      this.user = JSON.parse(user)
    }
  }
}
</script>

<style scoped>

.logo {
  height: 50px;
  width: 50%;
  margin-top: 5px;
  cursor: pointer;
  float: left;
}

.v-content {
  margin: 0 auto;
  max-width: 960px;
  text-align: center;
}

.v-right {
  line-height: 60px;
  float: right;
  min-width: 300px;
  width: 500px;
  position: relative;
}

</style>
