<template>
  <div>
    <Header/>
    <div style="margin: 20px 0 30px 5%;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item><a>默认分类</a></el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ blogTitleLength < 20 ? blog.title : blog.title.substring(0, 20) + '...' }}
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
            <el-link v-if="isEdit" :href="'/blog/'+blog.id+'/edit'" icon="el-icon-edit-outline"
                     style="margin-right: 15px" :underline="false">
              编辑
            </el-link>
            <el-link v-if="isEdit" @click="deleteBlog(blog.id)" icon="el-icon-delete" :underline="false">
              删除
            </el-link>
          </el-breadcrumb>
        </div>
        <div class="blog-detail">
          <div class="markdown-body" v-highlight>
            <VueMarkdown :source="blog.content"></VueMarkdown>
          </div>
        </div>
      </div>
      <div class="blog-main-right">
        <RightCard/>
      </div>
      <div v-show="isTalk" class="blog-main-left">
        <TalkInput/>
      </div>
      <div class="blog-main-left">
        <Talk/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import RightCard from "@/components/RightCard";
import Talk from "@/components/Talk";
import moment from "moment";
import 'github-markdown-css'
import VueMarkdown from 'vue-markdown'
import TalkInput from "@/components/TalkInput";

export default {
  name: "BlogDetail",
  components: {Header, RightCard, VueMarkdown, Talk, TalkInput},
  data() {
    return {
      blog: {},
      blogTitleLength: 0,
      isEdit: false,
      isTalk: true
    }
  },
  methods: {
    checkTalk(t) {
      this.isTalk = t
    },
    deleteBlog(id) {
      this.$axios.delete('/blog/delete/' + id, {
        headers: {
          'Authorization': localStorage.getItem('token') || 'null'
        }
      }).then(res => {
        this.$message.success(res.data.message)
        this.$router.push('/blogs')
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
      this.blogTitleLength = this.blog.title.length
      //获取页面的用户信息
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo != null) {
        //获取当前用户名
        this.username = userInfo.username
        //确认是否编辑
        this.isEdit = Number.parseInt(userInfo.id) === Number.parseInt(this.blog.userId)
      } else {
        this.isEdit = false
      }
      this.blog.userId = '-1'
    })
  },
}
</script>

<style scoped>

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

.blog-main-right {
  width: 23%;
  float: right;
}
</style>
