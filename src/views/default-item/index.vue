<template>
  <div class="app-container">
    <div class="p-filter">
      <el-input v-model="search" placeholder="Search by id" clearable class="u-inputWidth" />
      <el-button type="primary" class="" @click="handleAdd">Add</el-button>
    </div>

    <el-table v-loading="isLoading" :data="pagedTableData" border highlight-current-row style="margin-top: 30px">
      <el-table-column align="center" label="Id" prop="id" />
      <el-table-column align="center" label="Type">
        <template slot-scope="{row}">
          <span>{{ row.type | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="How to get">
        <template slot-scope="{row}">
          <span>{{ row.how_to_gets | formatGetterType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Rarity">
        <template slot-scope="{row}">
          <span v-if="row.stats">{{ row.stats.rarity | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Quantity Left" prop="quantity_left" />
      <el-table-column align="center" label="Quantity" prop="quantity" />
      <el-table-column align="center" label="Form">
        <template slot-scope="{row}">
          <span>{{ row.form }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="category">
        <template slot-scope="{row}">
          <span>{{ row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="u-paginationWrapper">
      <el-pagination
        :current-page.sync="tableFilters.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableFilters.size"
        layout="total, sizes, prev, pager, next"
        :total="sortedData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <modal-add v-if="addDialogVisible" :is-open="addDialogVisible" :edited-data="editedData" @updateTableData="updateTableData" @close-modal="addDialogVisible = false" />
  </div>
</template>

<script>
import { getDefaultItems, deleteItemById } from '@/api/default-items'
import ModalAdd from './modal-add'
import { getLabelFromStr } from '@/utils/format'
import { DELETE_SUCCESS_MESS } from '@/constants/messages'

export default {
  name: 'DefaultItem',
  components: { ModalAdd },
  filters: {
    formatGetterType: function(value) {
      if (!Array.isArray(value) || !value.length) return
      return value.map(el => getLabelFromStr(el)).join(', ')
    },
    formatType: function(value) {
      return getLabelFromStr(value)
    }
  },
  data() {
    return {
      isLoading: false,
      search: '',
      tableData: [],
      tableFilters: {
        page: 1,
        size: 10
      },
      addDialogVisible: false,
      editedData: {}
    }
  },
  computed: {
    sortedData() {
      return this.tableData.filter(el => typeof (el.id) === 'string' && el.id?.includes(this.search))
    },
    pagedTableData() {
      const { size, page } = this.tableFilters
      return this.sortedData.slice(size * page - size, size * page)
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.isLoading = true
      getDefaultItems().then(res => {
        this.isLoading = false
        if (Array.isArray(res.data)) {
          this.tableData = res.data
        }
      }, () => { this.isLoading = false })
    },
    handleSizeChange(val) {
      this.tableFilters.size = val
    },
    handleCurrentChange(val) {
      this.tableFilters.page = val
    },
    handleDelete(row) {
      this.$confirm(`Do you really want to delete ${row.id}?`, 'Confirmation', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteItemById(row.id).then(res => {
          this.$message({ type: 'success', message: DELETE_SUCCESS_MESS })
          this.tableData = this.tableData.filter(el => el.id !== row.id)
        }, () => {})
      })
    },
    handleEdit(row) {
      this.editedData = row
      this.addDialogVisible = true
    },
    handleAdd() {
      this.addDialogVisible = true
      this.editedData = {}
    },
    updateTableData(type, data) {
      if (type === 'add') {
        this.tableData.splice(0, 0, data)
      } else if (type === 'edit') {
        const idx = this.tableData.findIndex(el => el.id === data.id)
        this.tableData.splice(idx, 1, data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
