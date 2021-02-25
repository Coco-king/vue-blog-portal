<template>
  <div>
    <div style="margin-bottom: 10px"><i class="el-icon-chat-line-round"></i>&emsp;欢迎评论~</div>
    <div v-show="username !== ''" class="talk-title">
      <span style="color: #999999">登录身份：</span>
      <a href="#" class="user-home">{{ username }}</a>
      <a href="javascript:void(0)" @click="logOut" class="user-home">退出</a>
    </div>
    <el-input
        type="textarea"
        :rows="2" :autosize="{ minRows: 5, maxRows: 10}"
        placeholder="嘿~ 大神，别默默的看了，快来点评一下吧。。发表后需要审核哦"
        v-model="talk.content">
    </el-input>
    <el-button style="margin-top: 10px" type="primary" @click="addTalk">提交评论</el-button>
  </div>
</template>

<script>
import Talk from "@/components/Talk";

export default {
  name: "TalkInput",
  data() {
    return {
      username: '',
      talk: {
        content: ''
      },
    }
  },
  methods: {
    addTalk() {
      //准备数据
      let talk = JSON.parse(sessionStorage.getItem('talk')) || null
      if (!this.talk.content || this.talk.content.length <= 0) {
        this.$message.error("评论内容不能为空")
      } else if (talk != null) {
        sessionStorage.removeItem('talk')
        Object.assign(this.talk, talk);
        //发送请求
        this.$axios.post('/talk/add', this.talk, {
          headers: {
            'Authorization': localStorage.getItem('token') || ''
          }
        }).then(res => {
          this.$message.success(res.data.message)
          //调用父组件的方法
          this.$parent.getTalks()
          this.$parent.noReply1()
          this.$parent.noReply2()
        })
      } else {
        this.talk.parentId = 0
        let parse = JSON.parse(sessionStorage.getItem('userInfo'));
        if (parse == null) {
          this.talk.userId = -1
          this.talk.username = '游客'
          this.talk.blogId = this.$route.params.blogId
          this.talk.avatar = ''
          this.talk.replyName = '空'
        } else {
          this.talk.userId = parse.id
          this.talk.username = parse.username
          this.talk.blogId = this.$route.params.blogId
          this.talk.avatar = parse.avatar
          this.talk.replyName = '空'
        }
        //发送请求
        this.$axios.post('/talk/add', this.talk, {
          headers: {
            'Authorization': localStorage.getItem('token') || ''
          }
        }).then(res => {
          this.$message.success(res.data.message)
          this.$router.go(0)
        })
      }
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
        this.$router.go(0)
      })
    }
  },
  created() {
    //获取页面的用户信息
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo != null) {
      //获取当前用户名
      this.username = userInfo.username
    }
  },
  components: {Talk}
}
</script>

<style scoped>


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
  margin: 10px;
}
</style>
