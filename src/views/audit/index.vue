<template>
  <div class="app-container">
    <div class="group-filter">
      <div class="block">
        <el-date-picker
          v-model="rangeDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="dd-MM-yyyy"
          value-format="dd-MM-yyyy"
          :picker-options="pickerOptions"
        />
      </div>
      <el-select v-model="activedMember" placeholder="Select a member" class="margin-left">
        <el-option
          v-for="item in memberOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="activedAction" placeholder="Select a type" class="margin-left">
        <el-option
          v-for="item in actionOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="margin-left" @click="handleSearch">Search</el-button>
    </div>

    <el-table :data="tableData" border highlight-current-row style="margin-top: 30px">
      <el-table-column align="center" label="Name">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Time">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="{row}">
          <span>{{ row.action }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Audit',
  data() {
    return {
      isLoading: false,
      tableData: [],
      memberOpts: [
        { value: 'Member1', label: 'Member1' },
        { value: 'Member2', label: 'Member2' },
        { value: 'Member3', label: 'Member3' }
      ],
      activedMember: '',
      actionOpts: [
        { value: 'Action1', label: 'Action1' },
        { value: 'Action2', label: 'Action2' }
      ],
      activedAction: '',
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      rangeDate: ''
    }
  },
  created() {
    this.initDate()
  },
  methods: {
    initDate() {
      const formatedDate = 'DD-MM-YYY'
      const initStartDate = moment(new Date()).subtract(7, 'days').format(formatedDate)
      const initEndDate = moment(new Date()).format(formatedDate)
      this.rangeDate = [initStartDate, initEndDate]
    },
    handleSearch() {
      const startDate = this.rangeDate[0]
      const endDate = this.rangeDate[1]
      console.log('handleSearch', startDate, endDate, this.activedMember, this.activedAction)
    }
  }
}
</script>

<style lang="scss" scoped>
  .group-filter {
    display: flex;
    align-items: center;
  }

  .margin-left {
    margin-left: 15px;
  }
</style>
