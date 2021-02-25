<template>
  <div>
    <el-container>
      <el-header style="padding: 0">
        <Header/>
      </el-header>
      <el-container>
        <el-main>
          <el-button type="primary" size="small" @click="getAll">查询所有</el-button>
          <el-button type="success" size="small" @click="getAllNoVisibleList">查询未审核</el-button>
          <el-table
              :data="tableData"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'subTalks', hasChildren: 'hasChildren'}">
            <el-table-column
                prop="id"
                label="编号"
                sortable
                width="80">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                sortable
                width="140">
            </el-table-column>
            <el-table-column
                prop="blogId"
                sortable
                width="90"
                label="博客ID">
            </el-table-column>
            <el-table-column
                prop="created"
                sortable
                width="190"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="content"
                label="内容">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="60">
              <template slot-scope="scope">
                <el-button v-show="scope.row.visible === 0"
                    @click.native.prevent="pass(scope.$index, tableData, scope.row)"
                    type="text"
                    size="small">
                  通过
                </el-button>
                <el-button v-show="scope.row.visible === 1"
                    @click.native.prevent="noPass(scope.$index, tableData, scope.row)"
                    type="text"
                    size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "Manage",
  components: {Header},
  data() {
    const tableData = []
    return {
      tableData: []
    }
  },
  methods: {
    pass(a, b, c) {
      this.$axios.put('/talk/dbfda84701bc47b49451028e355d6fc7/pass/' + c.id).then(res => {
        this.$message.success(res.data.message)
        b.splice(a, 1);
      })
    },
    noPass(a, b, c) {
      this.$axios.put('/talk/dbfda84701bc47b49451028e355d6fc7/noPass/' + c.id).then(res => {
        this.$message.success(res.data.message)
        b.splice(a, 1);
      })
    },
    getAll() {
      //获取评论列表
      this.$axios.get('/talk/dbfda84701bc47b49451028e355d6fc7/allList').then(res => {
        this.tableData = res.data.data
        console.log(res.data.data)
        console.log(tableData)
        this.tableData.forEach(data => {
          if (data.subTalks != null && data.subTalks.length !== 0) {
            data.hasChildren = true
          }
        })
      })
    },
    getAllNoVisibleList() {
      //获取评论列表
      this.$axios.get('/talk/dbfda84701bc47b49451028e355d6fc7/allNoVisibleList').then(res => {
        this.tableData = res.data.data
        console.log(res.data.data)
        console.log(tableData)
        this.tableData.forEach(data => {
          if (data.subTalks != null && data.subTalks.length !== 0) {
            data.hasChildren = true
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
