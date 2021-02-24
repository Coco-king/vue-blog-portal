<template>
  <div>
    <Header/>
    <div class="blog-main">
      <div class="blog-left">
        <ul class="infinite-list" v-infinite-scroll="load" :infinite-scroll-disabled="isDisable"
            :infinite-scroll-immediate="false" style="overflow:auto">
          <el-timeline>
            <el-collapse accordion v-model="activeName" @change="handleChange">
              <li v-for="blog in blogList" :key="blog.id" class="infinite-list-item">
                <el-timeline-item :timestamp="dateFormat(blog.created)" placement="top">
                  <el-card>
                    <el-link :href="/blog/+blog.id" :underline="false">
                      <h3 style="margin: 5px 0">
                        {{ blog.title.length < 35 ? blog.title : blog.title.substring(0, 35) + '...' }}
                      </h3>
                    </el-link>
                    <div>
                      <el-collapse-item v-if="blog.description.length >= 50"
                                        :title="isDesc ? '点击收起' :'点击展开'" :name="blog.id">
                        <div>{{ blog.description }}</div>
                      </el-collapse-item>
                      <p v-else>{{ blog.description }}</p>
                    </div>
                  </el-card>
                </el-timeline-item>
              </li>
            </el-collapse>
          </el-timeline>
        </ul>
      </div>

      <div class="blog-right">
        <el-collapse-transition>
          <el-card :body-style="{ padding: '0px',paddingTop: '5px' }" class="box-card" v-show="showLastLogin === '1'"
                   style="position: relative;margin-bottom: 12px">
            <img height="232"
                 src="https://s3.ax1x.com/2021/02/23/yLwx5n.jpg"
                 alt="上次登录时间" class="image">
            <div style="padding: 14px;">
              <span class="card-body">上次登录时间</span>
              <div class="bottom clearfix">
                <time class="time">{{ user.lastLogin }}</time>
                <el-tooltip class="item" effect="dark" content="点击关闭该卡片" placement="right">
                  <el-button icon="el-icon-close" circle size="mini" plain @click="closeLastLogin"
                             style="float:right;position:absolute;right: 12px;bottom: 15px"></el-button>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-collapse-transition>

        <RightCard/>

      </div>
    </div>
    <el-backtop :visibility-height="60">
      <i class="el-icon-caret-top"></i>
    </el-backtop>
  </div>
</template>

<script>
import Header from "@/components/Header";
import RightCard from "@/components/RightCard";
import moment from "moment";

export default {
  name: "BlogList",
  data() {
    return {
      page: 1,
      size: 10,
      activeName: '0',
      isDesc: false,
      isDisable: false,
      showLastLogin: '0',
      blogList: [],
      user: {
        lastLogin: ''
      }
    };
  },
  methods: {
    handleChange() {
      this.isDesc = !this.isDesc
    },
    closeLastLogin() {
      this.showLastLogin = '0'
      localStorage.setItem('showLastLogin', '0')
    },
    load() {
      this.$axios.get('/blog/list?page=' + this.page + '&size=' + this.size).then(res => {
        this.page++
        let blogs = res.data.data.records;
        blogs.forEach(blog => {
          blog.userId = '-1'
          this.blogList.push(blog)
        })
        this.isDisable = blogs.length !== this.size
      })
    },
    dateFormat(date) {
      if (date === undefined) {
        return ''
      }
      return moment(date).format("YYYY年MM月DD日 HH:mm:ss")
    },
  },
  created() {
    Header.data().activeIndex = '2'
    const user = sessionStorage.getItem('userInfo');
    if (user) {
      this.showLastLogin = localStorage.getItem('showLastLogin') || '0';
      this.user = JSON.parse(user) || {}
      this.user.lastLogin = this.dateFormat(this.user.lastLogin)
    } else {

    }
  },
  components: {Header, RightCard}
}
</script>

<style scoped>

.blog-left {
  max-width: 75.5%;
  width: 75.5%;
  padding-top: 0.6%;
  position: absolute;
}

.blog-main {
  position: relative;
  margin: 0 auto;
  max-width: 90%;
}

.blog-right {
  padding-top: 4%;
  width: 23%;
  position: absolute;
  right: 0;
  top: 0;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}
</style>
