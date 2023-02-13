<template>
  <div class="app-container">
    <div class="uploadBtn">
      <el-button type="primary" @click="dialogVisible = true">
        Upload<i class="el-icon-upload el-icon-right" style="margin-left: 3px" />
      </el-button>
    </div>

    <el-dialog
      title="Upload Asset"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="margin-bottom: 8px">Select a platform:</div>
      <el-select v-model="activedPlatform" placeholder="Select platform" style="width: 100%;">
        <el-option
          v-for="item in platformOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-upload
        style="margin-top: 30px;"
        class="upload-full-width"
        action="https://jsonplaceholder.typicode.com/posts/"
        accept=".zip"
        drag
        :auto-upload="false"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-change="handleChange"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <div slot="tip" class="el-upload__tip">Only supports upload .zip suffix files.</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" :disabled="!fileList.length" @click="handleUpload">Upload</el-button>
      </span>
    </el-dialog>

    <el-table :data="tableData" border highlight-current-row style="margin-top: 10px">
      <el-table-column align="center" label="Name">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Last modified">
        <template slot-scope="{row}">
          <span>{{ row.lastModified | moment }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAssets, uploadAsset } from '@/api/assets/asset-bundle'
import moment from 'moment'

export default {
  name: 'AssetsManagement',
  filters: {
    moment: function(date) {
      return moment(date).format('DD-MM-YYYY, HH:mm:ss')
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      platformOpts: [
        { value: 'Android', label: 'Android' },
        { value: 'WebGL', label: 'WebGL' }
      ],
      activedPlatform: 'Android',
      fileList: []
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const res = await getAssets({ platform: 'Android' })
      this.tableData = res?.data || []
    },
    handleClose() {
      this.dialogVisible = false
      this.fileList = []
    },
    handleRemove(file, fileList) {
      this.fileList = []
    },
    handleChange(file, fileList) {
      this.fileList = [file]
    },
    handleUpload() {
      const formData = new FormData()
      formData.append('file', this.fileList?.[0]?.raw)
      formData.append('platform', this.activedPlatform)

      uploadAsset(formData).then(res => {
        this.$message({ message: 'Upload complete!', type: 'success' })
        this.dialogVisible = false
        this.fileList = []
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .uploadBtn {
    display: flex;
    justify-content: flex-end;
  }

  .upload-full-width::v-deep {
    .el-upload, .el-upload-dragger {
      width: 100%;
    }
  }
</style>
