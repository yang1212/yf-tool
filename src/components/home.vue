<template>
  <div>
    <p class="page-title">文本录入</p>
    <div class="page-box">
      <el-form :model="dynamicValidateForm"  :inline="true" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
        <div v-show="!showGenerate" v-for="(item, index) in dynamicValidateForm.formList"  :key="item.key" class="form-item">
          <el-form-item
           class="form-title"
            :label="index=== 0 ? '首屏(主标题)' : `标题${index}`"
            :prop="'formList.' + index + '.title'"
            :rules="{
              required: true, message: '标题不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="item.title"></el-input>
          </el-form-item>
          <el-form-item
            class="form-content"
            :label="index=== 0 ? '首屏(子标题)' : `内容${index}`"
            :prop="'formList.' + index + '.content'"
            :rules="{
              required: true, message: '内容不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="item.content" v-if="index===0"></el-input>
            <vue-editor v-model="item.content" v-else></vue-editor>
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="removecontent(index)" v-show="dynamicValidateForm.formList.length !== 1">删除</el-button>
            <el-button @click="addcontent" v-show="dynamicValidateForm.formList.length - 1 === index">新增</el-button>
          </el-form-item>
        </div>
       
        <div class="btn-group">
          <el-button v-show="!showGenerate" @click="resetForm('dynamicValidateForm')">重置</el-button>
          <el-button v-show="!showGenerate" type="primary" @click="submitForm('dynamicValidateForm')">一键生成</el-button>
          <el-button v-show="showGenerate" @click="showGenerate=false">返回</el-button>
          <el-button v-show="showGenerate" type="primary" @click="generateAndDownloadZip">一键导出</el-button>
        </div>
      </el-form>
    </div>
    <br/>
    <div class="img-box" v-show="showGenerate">
      <div v-for="(item, index) in list" :key="index" class="item" ref="items">
        <div class="item-content">
          <p class="title" :class="index === 0 ? 'title-0' : ''">{{item.title}}</p>
          <p class="info" :class="index === 0 ? 'info-0' : ''" v-html="item.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { VueEditor } from "vue2-editor";

export default {
  name: 'HomePage',
  components: {
    VueEditor,
  },
  data() {
    return {
      list: [],
      showGenerate: false,
      dynamicValidateForm: {
        formList: [
          {
            title: '',
            content: ''
          }
        ],
      },
      content: "<h1>Some initial content</h1>"
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showGenerate = true
            this.list = this.dynamicValidateForm.formList
            console.log(this.dynamicValidateForm.formList);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dynamicValidateForm.formList = 
      [
          {
            title: '',
            content: ''
          }
      ]
    },
    removecontent(index) {
      this.dynamicValidateForm.formList.splice(index, 1)
    },
    addcontent() {
      this.dynamicValidateForm.formList.push({
        title: '',
        content: '',
        key: `content-${Date.now()}`
      });
    },
    async generateAndDownloadZip() {
      const items = this.$refs.items;
      const zip = new JSZip();
      const folder = zip.folder("素材");

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          const canvas = await html2canvas(item, {
            scale: 2, // 提高缩放比例
            useCORS: true, // 确保跨域图片可以被渲染
            logging: true
          });
          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.split(',')[1]; // 去掉URL前缀部分
          folder.file(`素材-${i + 1}.png`, base64Data, {base64: true});
        } catch (error) {
          console.error('oops, something went wrong!', error);
        }
      }

      zip.generateAsync({type: "blob"})
        .then(content => {
          saveAs(content, "素材.zip");
        });
    },
  }
}
</script>
<style  scoped>
.page-title {
  position: fixed;
  background: #409EFF;
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 22px;
  line-height: 50px;
  padding-left: 20px;
  color: #fff;
  z-index: 2;
}
.page-box {
  width: 1200px;
  padding-top: 100px;
}
.form-item {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.form-title {
  width: 450px;
}
.form-title .el-input {
  width: 300px;
}
.form-content {
  width: 1000px;
}
.form-content .el-input {
  width: 500px;
}
.btn-group {
  position: fixed;
  right: 20px;
  top: 70px;
}


/* 图片样式 */
.img-box {
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 460px;
  margin-left: 10px;
  padding: 60px 0;
  background: #eee;
  border-radius: 10px;
  margin-top: 10px;
  /* padding-bottom: 30px; */
}
.item-content {
  width: 460px;
  height: 420px;
  background-image: url('../assets/bg.png');
  background-repeat: repeat;
  background-size: cover;
  position: relative;
  text-align: center;
  padding: 0px 110px;
  box-sizing: border-box;
}
.title {
  font-weight: bold;
  font-size: 22px;
  padding: 140px 0 0 0;
  margin-left: -30px;
}
.info {
  padding-top: 10px;
  text-align: left;
}

.title-0 {
  font-weight: bold;
  font-size: 45px;
  padding: 160px 0 0 0;
  margin-left: 0;
}
.info-0 {
  padding-top: 5px;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
}
/* 自定义样式 */
#editor1 {
  height: 350px;
  width: 400px;
}
.quillWrapper {
  padding-top: 15px;
  width: 800px;
}
</style>


