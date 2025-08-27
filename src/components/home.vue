<template>
  <div>
    <p class="page-title">
      <!-- <i class="el-icon-milk-tea"></i> -->
      图文生成
    </p>
    <div class="btn-group">
      <el-button v-show="!showGenerate" type="primary" @click="submitForm('dynamicValidateForm')">
        <i class="el-icon-edit"></i>
        一键生成
      </el-button>
      <el-button v-show="!showGenerate" @click="resetForm('dynamicValidateForm')">重置</el-button>
      <el-button v-show="showGenerate" type="primary" @click="generateAndDownloadZip">
        <i class="el-icon-download"></i>
        一键导出
      </el-button>
      <el-button v-show="showGenerate" @click="showGenerate=false">返回</el-button>
    </div>

    <div class="page-box">
      <el-form :model="dynamicValidateForm"  :inline="true" ref="dynamicValidateForm" label-width="80px" class="demo-dynamic" v-show="!showGenerate" >
        <div class="form-upload">
          <p class="form-upload-p">1、背景图片上传</p>
          <el-upload
            class="form-upload-cell"
            action=""
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p class="form-content-p">2、内容录入</p>
          <div v-for="(item, index) in dynamicValidateForm.formList"  :key="item.key" class="form-item">
            <el-form-item
              class="form-content"
              :prop="'formList.' + index + '.content'"
              :rules="{
                required: true, message: '内容不能为空', trigger: 'blur'
              }"
            >
              <vue-editor 
                v-model="item.content" 
                class="vue-editor" 
                :editor-options="{ preserveWhitespace: true, }" 
                :style="{ width: '90%', maxWidth: '800px' }">
                ></vue-editor>
            </el-form-item>
            <div class="item-btn-group">
              <el-button @click.prevent="removecontent(index)"  size="small" type="danger" v-show="dynamicValidateForm.formList.length !== 1">删除</el-button>
              <el-button @click="addcontent" size="small" v-show="dynamicValidateForm.formList.length - 1 === index">新增</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <br/>

    <div class="generate-box" v-show="showGenerate">
      <div v-for="(item, index) in list" :key="index" class="item" ref="items">
        <div class="item-content" id="image-container" :style="imageStyle">
          <p  v-html="item.content"></p>
        </div>
      </div>
    </div>

    <div class="footer-box">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" class="footer-a">湘ICP备2024078658号-1</a>
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
      list: [{
        content: '我是子标题'
      },
      {
        content: '我是子标题'
      }],
      showGenerate: false,
      dynamicValidateForm: {
        formList: [
          {
            content: '<h2></h2>' 
          }
        ],
      },
      fileList: [], // 存储上传的文件列表
      imageStyle: {
        height: '500px',
        width: '320px',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/assets/bg1.png)' // 设置默认背景图片
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件');
        return false;
      }
      return true;
    },
    handleChange(file) {
      console.log(111, file)
      // 每次上传新图片时，覆盖之前的图片
      this.fileList = [file];
      const objectURL = URL.createObjectURL(file.raw);
      // Set the background image style dynamically
      this.imageStyle.backgroundImage = `url(${objectURL})`;
    },
    handleSuccess(response) {
      // 假设 response 中包含了图片的 URL
      this.imageUrl = `${response.url}?t=${new Date().getTime()}`;
    },
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
            content: ''
          }
      ]
    },
    removecontent(index) {
      this.dynamicValidateForm.formList.splice(index, 1)
    },
    addcontent() {
      this.dynamicValidateForm.formList.push({
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
<style  lang="scss" scoped>
.page-title {
  position: fixed;
  background: #8b3dff;
  width: 100%;
  height: 60px;
  font-weight: bold;
  font-size: 22px;
  line-height: 60px;
  padding-left: 20px;
  color: #fff;
  z-index: 2;
  i {
    font-weight: bold;
    font-size: 34px;
    position: relative;
    top: 4px;
  }
}

.btn-group {
  position: fixed;
  text-align: right;
  top: 60px;
  background: #fff;
  width: 100%;
  padding-right: 15px;
  padding-top: 10px;
  box-sizing: border-box;
  z-index: 100;
}

.page-box {
  width: 100%;
  padding-bottom: 100px;
  overflow: hidden;
  .form-upload {
    margin: 0 0 10px 20px;
    padding-top: 130px;
    .form-upload-p {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 19px;
    }
  }
  .form-content-p {
    font-weight: bold;
    margin: 35px 0 15px 20px;
    font-size: 19px;
  }
  .form-item {
    margin-left: 20px;
    position: relative;
    padding-bottom: 40px;
    width: 100%;
    .item-btn-group {
      position: absolute;
      bottom: 20px;
      right: 50px;
    }
  }
}

/* 图片样式 */
.generate-box {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;
  .item {
    margin-left: 10px;
    margin-top: 10px;
    background: #fff;
    border-radius: 3px;
    padding: 10px;
    .item-content {
      background-color: #fff;
      position: relative;
      padding: 10% 20px;
      box-sizing: border-box;
      display: flex;
      white-space: pre-wrap;
    }
  }
}

.footer-box {
  position:fixed;
  background: #8f52f0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  bottom: 0;
  text-align: center;
  .footer-a {
    color: #fff;
  }
}

.editor-content {
  font-size: 42px; /* 设置默认字体大小 */
}
.el-button--primary {
  background: #8b3dff;
  border: 1px solid #8b3dff;
  width: 100px;
  padding: 12px 10px;
}
</style>


