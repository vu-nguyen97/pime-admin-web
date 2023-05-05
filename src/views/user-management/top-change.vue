<template>
  <div>
    <div class="u-formFilter mt-2">
      <div class="u-formFilter--left">Range date</div>
      <div class="u-formFilter--right">
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
    </div>
    <div class="u-formFilter mt-3">
      <div class="u-formFilter--left">Currency</div>
      <div class="u-formFilter--right">
        <el-select v-model="currency" placeholder="Select a currency">
          <el-option
            v-for="item in listCurrencies"
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
        <div>
          <el-radio v-model="banned" label="">All</el-radio>
          <el-radio v-model="banned" label="true" class="minWidth">Banned user</el-radio>
          <el-radio v-model="banned" label="false">Unbanned user</el-radio>
        </div>
        <div class="mt-1">
          <el-radio v-model="flow" label="">All</el-radio>
          <el-radio v-model="flow" label="SOURCE" class="minWidth">Source</el-radio>
          <el-radio v-model="flow" label="SINK">Sink</el-radio>
        </div>
      </div>
    </div>
    <el-button type="primary" size="small" class="mt-5 mb-3" @click="getListData">Search</el-button>

    <el-table ref="tableTopGold" v-loading="isLoading" :data="tableData" border highlight-current-row class="mt-3">
      <el-table-column align="center" width="110" label="Date">
        <template slot-scope="{row}"><span>{{ row.date }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="100" label="Account id">
        <template v-if="row.account" slot-scope="{row}"><span>{{ row.account.id }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="150" label="Username">
        <template v-if="row.account" slot-scope="{row}"><span>{{ row.account.username }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="150" label="Name">
        <template v-if="row.account" slot-scope="{row}"><span>{{ row.account.display_name }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110" label="Total">
        <template slot-scope="{row}"><span>{{ row.total | toThousandFilter }} {{ row.currency_type | getLabelFromStr }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="90" label="Flow">
        <template slot-scope="{row}"><span>{{ row.currency_flow | getLabelFromStr }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="140" label="Type">
        <template slot-scope="{row}"><span>{{ row.source_item_type || row.sink_item_type | getLabelFromStr }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="120" label="Chip">
        <template v-if="row.account && row.account.currency" slot-scope="{row}"><span>{{ row.account.currency.chip | toThousandFilter }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110" label="Gem">
        <template v-if="row.account && row.account.currency" slot-scope="{row}"><span>{{ row.account.currency.gem | toThousandFilter }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110" label="Gold">
        <template v-if="row.account && row.account.currency" slot-scope="{row}"><span>{{ row.account.currency.gold | toThousandFilter }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110" label="Pime">
        <template v-if="row.account && row.account.currency" slot-scope="{row}"><span>{{ row.account.currency.pime | toThousandFilter }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="110" label="Usdt">
        <template v-if="row.account && row.account.currency" slot-scope="{row}"><span>{{ row.account.currency.usdt | toThousandFilter }}</span></template>
      </el-table-column>
      <el-table-column align="center" width="150" label="Ban Reason">
        <template v-if="row.account && row.account.ban_status" slot-scope="{row}"><span class="text-danger">{{ row.account.ban_status.ban_reason | getLabelFromStr }}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLabelFromStr } from '@/filters/index'
import { getTopChangedGold, getCurrencyTypes } from '@/api/user-management'
import { pickerOptions, init7Days } from '@/utils/helpers/calendar'
import { DEFAULT_CURRENCY } from '@/constants/constants'

export default {
  name: 'TopChange',
  data() {
    return {
      isLoading: false,
      pickerOptions,
      rangeDate: init7Days(),
      tableData: [],
      listCurrencies: [],
      currency: null,
      banned: '',
      flow: ''
    }
  },
  created() {
    this.getListData()
    getCurrencyTypes().then(res => {
      if (!res.data?.length) return

      this.listCurrencies = res.data.map(el => {
        return { label: getLabelFromStr(el), value: el }
      })

      if (res.data.includes(DEFAULT_CURRENCY)) {
        this.currency = DEFAULT_CURRENCY
      }
    })
  },
  methods: {
    getListData() {
      const { flow, banned } = this
      const [startDate, endDate] = this.rangeDate
      const params = {
        from: startDate,
        to: endDate,
        currency: this.currency || DEFAULT_CURRENCY,
        banned,
        flow
      }
      getTopChangedGold(params).then(res => {
        this.tableData = res.data || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.minWidth {
  min-width: 105px;
}
</style>
