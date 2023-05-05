<template>
  <div class="app-container">
    <div class="p-filter">
      <div>
        <el-input v-model="search" placeholder="Search by id" prefix-icon="el-icon-search" clearable class="u-inputWidth" />
        <el-select v-model="activedCategories" placeholder="Select a type" clearable class="ml-3">
          <el-option
            v-for="item in listCategories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-if="activedCategories" v-model="activedTypes" placeholder="Select a type" class="ml-3" clearable multiple collapse-tags>
          <el-option
            v-for="item in listTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" class="" @click="handleAdd">
        <i class="pi pi-plus pi-btnSize" />
        Add
      </el-button>
    </div>

    <el-table ref="tableDefaultItem" v-loading="isLoading" :data="pagedTableData" border highlight-current-row class="mt-5">
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="category" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.category | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="type" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.type | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id">
        <template slot="header">
          <table-sort-icons field="id" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="How to get">
        <!-- <el-table-column align="center">
          <template slot="header">
            <table-sort-icons field="how_to_gets" field-label="How to get" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
          </template> -->
        <template slot-scope="{row}">
          <span>{{ row.how_to_gets | formatGetterType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="rarity" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span v-if="row.stats">{{ row.stats.rarity | formatType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="quantity_left">
        <template slot="header">
          <table-sort-icons field="quantity_left" field-label="Quantity Left" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="quantity">
        <template slot="header">
          <table-sort-icons field="quantity" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="form" table-ref="tableDefaultItem" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.form }}</span>
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
    <modal-add v-if="addDialogVisible" :category-data="categoryData" :is-open="addDialogVisible" :edited-data="editedData" @updateTableData="updateTableData" @close-modal="addDialogVisible = false" />
  </div>
</template>

<script>
import { getDefaultItems, deleteItemById, getAllCategories } from '@/api/default-items'
import ModalAdd from './modal-add'
import { getLabelFromStr } from '@/filters/index'
import { DELETE_SUCCESS_MESS } from '@/constants/messages'
import { SORT_TYPES } from '@/constants/constants'
import TableSortIcons from '@/components/TableSortIcons'
import { getActivedType, sortTableMultiple } from '@/utils/helper'

export default {
  name: 'DefaultItem',
  components: { ModalAdd, TableSortIcons },
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
        size: 50
      },
      sortData: {},
      addDialogVisible: false,
      editedData: {},
      activedCategories: null,
      activedTypes: [],
      categoryData: [],
      listCategories: [],
      listTypes: []
    }
  },
  computed: {
    sortedData() {
      const { activedCategories, activedTypes } = this

      const filteredData = this.tableData.filter(el => {
        const isContainText = typeof (el.id) === 'string' && el.id?.includes(this.search)
        const isContainCategory = activedCategories ? el.category === activedCategories : true
        const isContainType = activedTypes.length ? activedTypes.includes(el.type) : true
        return isContainText && isContainCategory && isContainType
      })

      return this.handleSort(filteredData)
    },
    pagedTableData() {
      const { size, page } = this.tableFilters
      return this.sortedData.slice(size * page - size, size * page)
    }
  },
  watch: {
    activedCategories(newValue) {
      this.listTypes = getActivedType(this.categoryData, newValue)
      this.activedTypes = []
    }
  },
  created() {
    this.getCategories()
    this.getTableData()
  },
  methods: {
    handleSort(listData = this.tableData) {
      const SortMap = [
        { field: 'category', type: SORT_TYPES.string },
        { field: 'type', type: SORT_TYPES.string },
        { field: 'id', type: SORT_TYPES.string },
        { field: 'rarity', type: SORT_TYPES.string, getField: (el) => el.stats },
        { field: 'quantity_left', type: SORT_TYPES.number },
        { field: 'quantity', type: SORT_TYPES.number },
        { field: 'form', type: SORT_TYPES.number }
      ]

      return sortTableMultiple(listData, this.sortData, SortMap)
    },
    getTableData() {
      this.isLoading = true
      getDefaultItems().then(res => {
        this.isLoading = false
        if (Array.isArray(res.data)) {
          this.tableData = res.data
        }
      }, () => { this.isLoading = false })
    },
    getCategories() {
      getAllCategories().then(res => {
        if (res.data?.length) {
          const newCategories = res.data.map(el => {
            return { label: getLabelFromStr(el.category), value: el.category }
          })
          this.listCategories = newCategories
          this.categoryData = res.data
        }
      }, () => {})
    },
    handleSizeChange(val) {
      this.tableFilters.size = val
    },
    handleCurrentChange(val) {
      this.tableFilters.page = val
    },
    handleDelete(row) {
      this.$confirm(`Do you really want to delete "${row.id}" ?`, 'Confirmation', {
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
