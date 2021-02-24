<template>
  <div>
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
</template>

<script>
export default {
  name: "RightCard",
  data() {
    return {
      showCategory: true,
      category: {
        count: 0
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
  width: 100%;
}

.item {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
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
</style>
