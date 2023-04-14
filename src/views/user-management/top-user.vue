<template>
  <div>
    <div class="u-formFilter mt-2">
      <div class="u-formFilter--left">Date</div>
      <div class="u-formFilter--right">
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="Pick a day"
        />
      </div>
    </div>
    <div class="u-formFilter mt-3">
      <div class="u-formFilter--left">Top</div>
      <div class="u-formFilter--right">
        <el-select v-model="topType" placeholder="Select">
          <el-option
            v-for="item in listTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    <el-button type="primary" size="small" class="mt-5 mb-3" @click="getTableData">Search</el-button>

    <el-table ref="tableTopLevel" v-loading="isLoading" :data="pagedTableData" border highlight-current-row class="mt-3">
      <el-table-column type="expand">
        <template v-if="props.row.stats" slot-scope="props">
          <el-descriptions title="Stats:" :column="2" class="px-3">
            <el-descriptions-item v-for="(value, stat) in props.row.stats " :key="stat" :label="stat">
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140">
        <template slot="header">
          <table-sort-icons
            field="account_id"
            field-label="Account id"
            table-ref="tableTopLevel"
            :sort-data="sortData"
            :self="this"
            :has-search="true"
            :search-data="searchData"
            @updateSearch="updateSearch"
          />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.account_id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" width="100">
        <template slot="header">
          <table-sort-icons field="sex" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="username">
        <template slot="header">
          <table-sort-icons
            field="username"
            table-ref="tableTopLevel"
            :sort-data="sortData"
            :self="this"
            :has-search="true"
            :search-data="searchData"
            @updateSearch="updateSearch"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="display_name">
        <template slot="header">
          <table-sort-icons
            field="display_name"
            field-label="Name"
            table-ref="tableTopLevel"
            :sort-data="sortData"
            :self="this"
            :has-search="true"
            :search-data="searchData"
            @updateSearch="updateSearch"
          />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <table-sort-icons field="created_at" field-label="Created at" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template slot-scope="{row}">
          <span>{{ row.created_at | moment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="last_join_at">
        <template slot="header">
          <table-sort-icons field="last_join_at" field-label="Last join at" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="country">
        <template slot="header">
          <table-sort-icons field="country" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="chip" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.chip | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="gem" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.gem | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="gold" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.gold | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="pime" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.pime | numberWithCommas }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110">
        <template slot="header">
          <table-sort-icons field="usdt" table-ref="tableTopLevel" :sort-data="sortData" :self="this" />
        </template>
        <template v-if="row.currency" slot-scope="{row}"><span>{{ row.currency.usdt | numberWithCommas }}</span></template>
      </el-table-column>
    </el-table>
    <div class="u-paginationWrapper">
      <el-pagination
        :current-page="tableFilters.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableFilters.size"
        layout="total, sizes, prev, pager, next"
        :total="sortedData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { searchTopLevel } from '@/api/user-management'
import moment from 'moment'
import { FORMATTED_DATE } from '@/constants/constants'
import { numberWithCommas } from '@/utils/helper'
import TableSortIcons from '@/components/TableSortIcons'

export default {
  name: 'TopUser',
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
      date: moment(),
      banned: '',
      tableData: [],
      tableFilters: { page: 1, size: 10 },
      sortData: {},
      searchData: {},
      listTypes: [{ value: 'LEVEL', label: 'Level' }, { value: 'GOLD', label: 'Gold' }, { value: 'USDT', label: 'Usdt' }],
      topType: 'LEVEL'
    }
  },
  computed: {
    sortedData() {
      if (!Object.keys(this.searchData).length) return this.tableData

      return this.tableData.filter((el, idx) => {
        const isRemove = Object.entries(this.searchData).some(([field, value]) => {
          if (!value) return false

          const elValue = el[field]
          if (typeof elValue === 'string' || typeof elValue === 'number') {
            return !elValue.toString()?.includes(value)
          }
          return true
        })
        return !isRemove
      })
    },
    pagedTableData() {
      const { size, page } = this.tableFilters
      return this.sortedData.slice(size * page - size, size * page)
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
    getTableData() {
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
        date: moment(this.date).format(FORMATTED_DATE),
        banned: this.banned,
        top: this.topType,
        size: 100,
        sort: sort.join(',')
      }

      this.isLoading = true
      searchTopLevel(params).then(res => {
        this.isLoading = false
        this.tableData = res.data || []
      }, () => { this.isLoading = false })
    },
    handleSizeChange(val) {
      this.tableFilters.size = val
    },
    handleCurrentChange(val) {
      this.tableFilters.page = val
    },
    updateSearch(newData) {
      this.searchData = newData
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
