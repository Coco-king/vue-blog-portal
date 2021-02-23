<template>
  <div>
    <Header/>
    <div class="blog-main">
      <div class="blog-left">
        <ul class="infinite-list" v-infinite-scroll="load" :infinite-scroll-disabled="isDisable"
            :infinite-scroll-immediate="false" style="overflow:auto">
          <el-timeline>
            <li v-for="blog in blogList" :key="blog.id" class="infinite-list-item">
              <el-timeline-item :timestamp="dateFormat(blog.created)" placement="top">
                <el-card>
                  <h4>{{ blog.title }}</h4>
                  <p>{{ blog.description }}</p>
                </el-card>
              </el-timeline-item>
            </li>
          </el-timeline>
        </ul>
      </div>

      <div class="blog-right">
        <el-collapse-transition>
          <el-card :body-style="{ padding: '8px' }" class="box-card" v-show="showLastLogin" style="position: relative">
            <img height="232"
                 src="https://s3.ax1x.com/2021/02/23/yLwx5n.jpg"
                 alt="上次登录时间" class="image">
            <div style="padding: 14px;">
              <span class="card-body">上次登录时间</span>
              <div class="bottom clearfix">
                <time class="time">{{ user.lastLogin }}</time>
                <el-tooltip class="item" effect="dark" content="点击关闭该卡片" placement="right">
                  <el-button icon="el-icon-close" circle size="mini" plain @click="showLastLogin = false"
                             style="float:right;position:absolute;right: 12px;bottom: 15px"></el-button>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-collapse-transition>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-th"> <i class="el-icon-reading"></i>&emsp;栏目分类</span>
            <el-button v-show="showCategory" style="float: right; padding: 3px 0"
                       @click="showCategory = false" type="text">点击收起
            </el-button>
            <el-button v-show="!showCategory" style="float: right; padding: 3px 0"
                       @click="showCategory = true" type="text">点击展开
            </el-button>
          </div>
          <el-collapse-transition>
            <div v-show="showCategory">
              <div v-for="o in 4" :key="o" class="text item">
                <el-link :underline="false" icon="el-icon-view el-icon--right">
                  {{ '列表内容 ' + o }}
                </el-link>
                <el-badge class="mark" :max="99" type="info" :value="category.count"/>
              </div>
            </div>
          </el-collapse-transition>
        </el-card>
      </div>
    </div>
    <el-backtop :visibility-height="60">
      <i class="el-icon-caret-top"></i>
    </el-backtop>
  </div>
</template>

<script>
import Header from "@/components/Header";
import moment from "moment";

export default {
  name: "BlogList",
  data() {
    return {
      page: 1,
      size: 10,
      isDisable: false,
      showLastLogin: false,
      showCategory: true,
      blogList: [],
      user: {
        lastLogin: ''
      },
      category: {
        count: 0
      }
    };
  },
  methods: {
    load() {
      this.$axios.get('/blog/list?page=' + this.page + '&size=' + this.size).then(res => {
        this.page++
        let blogs = res.data.data.records;
        blogs.forEach(blog => {
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
    const user = sessionStorage.getItem('userInfo');
    if (user) {
      this.showLastLogin = true;
      this.user = JSON.parse(user) || {}
      this.user.lastLogin = this.dateFormat(this.user.lastLogin)
    } else {

    }
  },
  components: {Header}
}
</script>

<style scoped>

.blog-left {
  width: 75%;
  z-index: 2;
  padding-top: 0.4%;
  position: absolute;
}

.blog-main {
  position: relative;
  margin: 0 auto;
  max-width: 80%;
}

.blog-right {
  padding-top: 4%;
  width: 23%;
  position: absolute;
  right: 0;
  top: 0;
}

.box-card {
  margin-bottom: 20px;
  width: 100%;
}

.mark {
  float: right;
  cursor: pointer;
}

.card-th {
  font-weight: 1000;
  color: #666;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
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
