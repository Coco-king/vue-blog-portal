<template>
  <div>

    <div style="margin: 20px 0">已有 {{ total }} 条评论</div>

    <div style="margin-top: 10px;line-height: 22px">
      <div v-for="(talk,index) in talks" :key="talk.id" class="talk-main">
        <div style="position:relative;">
          <el-avatar style="position:absolute;" :size="50" :src="talk.avatar"></el-avatar>
          <a href="javascript:void(0)" class="talk-username"><span v-text="talk.username"></span></a>
          <div class="talk-content-main">
            {{ talk.content }}
          </div>
          <div style="margin-left: 60px;margin-top: 6px">
            <div v-if="isTrue1 !== index" class="button-green" @click="reply1(talk,index)">
              回复
            </div>
            <div v-if="isTrue1 === index" class="button-green" @click="noReply1">
              取消回复
            </div>
            <span style="color: #999;font-size: 12px;margin-left: 12px">{{ dateFormat(talk.created) }}</span>
          </div>
          <el-collapse-transition>
            <TalkInput v-show="isReply1 === index" style="margin: 10px 0"/>
          </el-collapse-transition>
        </div>
        <div v-for="(t,i) in talk.subTalks" class="talk-reply talk-main ">
          <div style="position:relative;">
            <el-avatar :size="50" style="position:absolute;" :src="t.avatar"></el-avatar>
            <a href="javascript:void(0)" class="talk-username"><span v-text="t.username"></span></a>
            <a href="javascript:void(0)" class="talk-reply-username">
              <span>@{{ t.replyName }}</span>
            </a>
            <div class="talk-content-main" style="padding-top: 0">
              {{ t.content }}
            </div>
            <div style="margin-left: 60px;margin-top: 6px">
              <div v-if="isTrue2 !== i" class="button-green" @click="reply2(t,i,talk.id)">
                回复
              </div>
              <div v-if="isTrue2 === i" class="button-green" @click="noReply2">
                取消回复
              </div>
              <span style="color: #999;font-size: 12px;margin-left: 12px">{{ dateFormat(t.created) }}</span>
            </div>
            <el-collapse-transition>
              <TalkInput v-show="isReply2 === i" style="margin-top: 10px"/>
            </el-collapse-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import TalkInput from "@/components/TalkInput";

export default {
  name: "Talk",
  components: {TalkInput},
  data() {
    return {
      total: 0,
      talks: [],
      isReply1: -1,
      isReply2: -1,
      isTrue1: -1,
      isTrue2: -1,
      talk: {}
    }
  },
  methods: {
    reply1(t, i) {
      this.noReply2()
      this.isReply1 = i
      this.isTrue1 = i
      this.$parent.checkTalk(false)
      this.talk.parentId = t.id
      let parse = JSON.parse(sessionStorage.getItem('userInfo'));
      this.talk.userId = parse.id
      this.talk.username = parse.username
      this.talk.blogId = this.$route.params.blogId
      this.talk.avatar = parse.avatar
      this.talk.replyName = t.username
      sessionStorage.setItem('talk', JSON.stringify(this.talk))
    },
    reply2(t, i, parentId) {
      this.isReply2 = i
      this.isTrue2 = i
      this.noReply1()
      this.$parent.checkTalk(false)
      this.talk.parentId = parentId
      let parse = JSON.parse(sessionStorage.getItem('userInfo'));
      this.talk.userId = parse.id
      this.talk.username = parse.username
      this.talk.blogId = this.$route.params.blogId
      this.talk.avatar = parse.avatar
      this.talk.replyName = t.username
      sessionStorage.setItem('talk', JSON.stringify(this.talk))
    },
    noReply1() {
      this.isReply1 = -1
      this.isTrue1 = -1
      this.$parent.checkTalk(true)
      sessionStorage.removeItem('talk')
    },
    noReply2() {
      this.isReply2 = -1
      this.isTrue2 = -1
      this.$parent.checkTalk(true)
      sessionStorage.removeItem('talk')
    },
    dateFormat(date) {
      if (date === undefined) {
        return ''
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    getTalks() {
      this.total = 0
      //获取评论列表
      this.$axios.get('/talk/' + this.$route.params.blogId + '/list').then(res => {
        this.talks = res.data.data
        this.talks.forEach(talk => {
          talk.subTalks.forEach(res => {
            this.total++
          })
          this.total++
        })
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
    this.getTalks()
  }
}
</script>

<style scoped>

.button-green {
  display: inline-block;
  border: 1px #c1c1c1 solid;
  font-size: 10px;
  line-height: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 4px;
  color: #b6b6b6;
  font-weight: 480;
  background-color: #fdfdfd;
  cursor: pointer;
  transition: all 0.2s;
}

.button-green:hover {
  background-color: #b6b6b6;
  color: #fdfdfd;
  border-color: #b6b6b6;
}

.talk-username {
  position: absolute;
  left: 60px;
  top: 1px;
  font-size: 13px;
  text-decoration: none;
  color: #444444;
  font-weight: 550;
}

.talk-reply-username {
  display: block;
  margin-left: 65px;
  padding-top: 20px;
  font-size: 13px;
  text-decoration: none;
  color: #636363;
  font-weight: 550;
}

.talk-username:hover {
  color: #666666;
}

.talk-reply {
  margin-left: 60px;
  margin-top: 10px;
}

.talk-main {
  min-height: 80px;
}

.talk-content-main {
  padding-top: 20px;
  padding-left: 60px;
  color: #767676;
  font-size: 14px;
  max-width: 80%;
}

</style>
