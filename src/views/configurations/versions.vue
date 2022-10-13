<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column min-width="100px" align="center" label="Platform">
        <template slot-scope="{row}">
        <span>{{ row.platform }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="Min Version">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.min" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.min }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="Max Version">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.max" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.max }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="Link">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.link" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.link }}</span>
        </template>
      </el-table-column>


      <!-- <el-table-column min-width="300px" label="Actions">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.bfc" class="edit-input" size="small" type="number" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.bfc }}</span>
        </template>
      </el-table-column> -->
      
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, update } from '@/api/configs/versions'

export default {
  name: 'Versions',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        // this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.edit = false
        v.originMin = v.min //  will be used when user click the cancel botton
        v.originMax = v.max
        v.originLink = v.link
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.min = row.originMin
      row.max = row.originMax
      row.link = row.originLink
      row.edit = false
      this.$message({
        message: 'Restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {      
      const tempData = Object.assign({}, row)
      update(tempData).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })           
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
