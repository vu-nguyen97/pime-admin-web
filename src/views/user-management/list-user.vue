<template>
  <div>
    <div class="u-formFilter mt-2">
      <div class="u-formFilter--left">Search</div>
      <div class="u-formFilter--right">
        <el-input v-model="search" placeholder="Search by id, name, username" clearable style="width: 250px" />
      </div>
    </div>
    <div class="u-formFilter mt-3">
      <div class="u-formFilter--left">Include</div>
      <div class="u-formFilter--right">
        <el-radio v-model="banned" label="">All</el-radio>
        <el-radio v-model="banned" label="true">Banned user</el-radio>
        <el-radio v-model="banned" label="false">Unbanned user</el-radio>
      </div>
    </div>
    <el-button type="primary" size="small" class="mt-5 mb-3" @click="handleSearch">Search</el-button>

    <el-table ref="tableListUser" v-loading="isLoading" :data="tableData" border highlight-current-row class="mt-3">
      <el-table-column type="expand">
        <template v-if="props.row.stats" slot-scope="props">
          <el-descriptions title="Stats:" :column="2" class="px-3">
            <el-descriptions-item v-for="(value, stat) in props.row.stats " :key="stat" :label="stat">
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column align="center" width="70" prop="id">
        <template slot="header">
          <table-sort-icons field="id" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span class="cursor-pointer hover-primary" title="View this user" @click="handleClickView(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="sex">
        <template slot="header">
          <table-sort-icons field="sex" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="username">
        <template slot="header">
          <table-sort-icons field="username" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="display_name">
        <template slot="header">
          <table-sort-icons field="display_name" field-label="Name" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="created_at" field-label="Created at" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.created_at | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="last_join_at">
        <template slot="header">
          <table-sort-icons field="last_join_at" field-label="Last join at" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="country">
        <template slot="header">
          <table-sort-icons field="country" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="chip" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.chip | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="gem" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.gem | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="gold" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.gold | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="pime" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.pime | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="usdt" table-ref="tableListUser" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.usdt | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" label="Action" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleClickView(row)">
            View
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="u-paginationWrapper">
      <el-pagination
        :current-page="tableMeta.page + 1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableMeta.size"
        layout="total, sizes, prev, pager, next"
        :total="tableMeta.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getAllUser } from '@/api/user-management'
import moment from 'moment'
import { numberWithCommas } from '@/utils/helper'
import TableSortIcons from '@/components/TableSortIcons'

export default {
  name: 'ListUser',
  components: { TableSortIcons },
  filters: {
    moment: function(date) {
      return moment(date).format('DD-MM-YYYY, HH:mm:ss')
    },
    numberWithCommas
  },
  data() {
    return {
      isLoading: false,
      search: '',
      banned: '',
      tableData: [],
      tableMeta: { page: 0, size: 20 },
      sortData: {}
    }
  },
  watch: {
    sortData(newValue, oldValue) {
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleClickView(rowData) {
      this.$router.push({ name: 'UserDetail', params: { id: rowData.id }})
      // this.$router.push({ path: `/user-management/user-detail/${rowData.id}` })
    },
    getTableData() {
      const { size, page } = this.tableMeta
      const listCurrencies = ['pime', 'gold', 'usdt', 'chip', 'gem']
      const sort = []

      for (const [key, value] of Object.entries(this.sortData)) {
        if (!value) continue

        let newKey = key
        if (listCurrencies.includes(key)) {
          newKey = 'currency.' + key
        }
        sort.push(value + newKey)
      }

      const params = {
        banned: this.banned,
        size,
        page,
        keyword: this.search,
        sort: sort.join(';')
      }

      this.isLoading = true
      getAllUser(params).then(res => {
        this.isLoading = false
        this.tableData = res.data?.data || []
        this.tableMeta = res.data?.meta || {}
      }, () => { this.isLoading = false })
    },
    handleSizeChange(val) {
      this.tableMeta.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableMeta.page = val - 1
      this.getTableData()
    },
    handleSearch() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
