<template>
  <div>
    <Header/>
    <h2 style="text-align: center;color: #555">发布文章</h2>
    <div class="edit-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>
        <el-form-item style="margin-left: 32%">
          <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "EditBlog", data() {
    return {
      ruleForm: {
        title: '',
        description: '',
        content: '',
        userId: ''
      },
      rules: {
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'},
          {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
        ],
        description: [
          {min: 0, max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '正文内容不能为空', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    postBlog() {
      const user = JSON.parse(sessionStorage.getItem('userInfo')) || {};
      this.ruleForm.userId = user.id
      this.$axios.post('/blog/edit', this.ruleForm, {
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      }).then(res => {
        this.$alert(res.data.message || '操作成功', '返回主页', {
          confirmButtonText: '确定',
          type: 'success',
          callback: action => {
            this.$router.push('/blogs')
          }
        });
      }).catch(res => {
        this.$message.error('发布失败，请尝试重新登陆或联系管理员')
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postBlog()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {Header}
}
</script>

<style scoped>
.edit-content {
  margin: 20px auto;
  max-width: 1080px;
  width: 960px;
  min-width: 660px;
}
</style>
