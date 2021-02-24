<template>
  <div>
    <Header/>
    <div style="margin: 20px 0 30px 5%;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item><a>默认分类</a></el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ blog.title.length < 20 ? blog.title : blog.title.substring(0, 20) + '...' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="blog-main-content">
      <div class="blog-main-left">
        <h1 style="margin: 0">{{ blog.title }}</h1>
        <div class="split">
          <el-breadcrumb separator="  ">
            <el-breadcrumb-item>
              <span class="detail">
                <i class="el-icon-user"></i>
                &emsp;{{ blog.userName }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <span class="detail">
                <i class="el-icon-time"></i>
                &emsp;{{ dateFormat(blog.created) }}
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <span class="detail">
                <i class="el-icon-chat-dot-round"></i>
                &emsp;{{ blog.talkCount || 0 }}
              </span>
            </el-breadcrumb-item>
            <el-link v-if="isEdit" :href="'/blog/'+blog.id+'/edit'" icon="el-icon-edit-outline" :underline="false">
              编辑
            </el-link>
          </el-breadcrumb>
        </div>
        <div class="blog-detail">
          <div v-html="blog.content" class="markdown-body">暂无内容</div>
        </div>
      </div>
      <div class="blog-main-right">
        <RightCard/>
      </div>
      <div class="blog-main-left">
        <div><i class="el-icon-chat-line-round"></i>&emsp;欢迎评论~</div>
        <div v-show="username !== ''" class="talk-title">
          <span style="color: #999999">登录身份：</span>
          <a href="#" class="user-home">{{ username }}</a>
          <a href="javascript:void(0)" @click="logOut" class="user-home">退出</a>
        </div>
        <el-input
            type="textarea"
            :rows="2" :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="嘿~ 大神，别默默的看了，快来点评一下吧"
            v-model="talk.content">
        </el-input>
        <el-button style="margin-top: 10px" type="primary">提交评论</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import RightCard from "@/components/RightCard";
import moment from "moment";
import 'github-markdown-css'

export default {
  name: "BlogDetail",
  components: {Header, RightCard},
  data() {
    return {
      blog: {},
      isEdit: false,
      username: '',
      talk: {
        content: ''
      }
    }
  },
  methods: {
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
        this.$router.go(0)
      })
    },
    dateFormat(date) {
      if (date === undefined) {
        return ''
      }
      return moment(date).format("YYYY年MM月DD日 HH:mm:ss")
    }
  },
  created() {
    const blogId = this.$route.params.blogId || '0'
    this.$axios.get('/blog/' + blogId).then(res => {
      this.blog = res.data.data
      //初始化markdown格式
      const MarkdownIt = require('markdown-it')
      const md = new MarkdownIt()
      this.blog.content = md.render(this.blog.content)
      //获取页面的用户信息
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '')
      //确认是否编辑
      this.isEdit = Number.parseInt(userInfo.id) === Number.parseInt(this.blog.userId)
      //获取当前用户名
      this.username = userInfo.username
      this.blog.userId = '-1'
    })
  }
}
</script>

<style scoped>

.edit:hover {
  color: #999999;
}

.user-home {
  text-decoration: none;
  color: #333333;
  margin-right: 6px;
}

.user-home:hover {
  color: #666666;
}

.talk-title {
  font-size: 12px;
  margin: 20px 10px;
}

.split {
  padding: 25px 10px;
  margin: 10px 0;
  background-color: #f7f7f7;
  border-radius: 6px;
}

.detail {
  color: #888888;
  font-weight: 600;
}

.blog-main-content {
  max-width: 90%;
  margin: 0 auto;
}

.blog-main-left {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
  box-sizing: border-box;
  max-width: 75.5%;
  width: 75.5%;
  float: left;
  padding: 30px 30px 20px 30px;
  margin-bottom: 12px;
  border-radius: 4px;
}

.blog-main-right {
  width: 23%;
  float: right;
}
</style>
