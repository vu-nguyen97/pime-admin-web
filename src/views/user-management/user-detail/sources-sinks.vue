<template>
  <div class="p-6 bg-white shadow-lg rounded border mt-6">
    <div class="p-sectionTitle">Sources & Sinks</div>
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
    <el-button type="primary" class="ml-3" @click="handleSearch">Search</el-button>

    <div class="mt-5 flex small-scroll">
      <div class="flex-1 h-auto">
        <div class="text-lg p-4 border rounded h-full custom-height">
          <div class="font-bold text-center">Sources</div>
          <div class="divider-max-width m-auto"><el-divider class="my-4" /></div>
          <div v-if="sources.length" class="">
            <div v-for="source in sources" :key="source.id" class="mt-1 flex justify-between">
              <div>
                <span>{{ source.source_item_type | getLabelFromStr }}:</span>
                <span class="sourceNumber ml-2 mr-1 text-xl">+{{ source.total }}</span><span class="text-md">{{ source.currency_type | getLabelFromStr }}</span>
              </div>
              <div class="text-md text-filter">{{ source.createdAt }}</div>
            </div>
          </div>
          <div v-else class="u-noData">No data</div>
        </div>
      </div>
      <div class="flex-1 h-auto ml-6">
        <div class="text-lg p-4 border rounded h-full custom-height">
          <div class="font-bold text-center">Sinks</div>
          <div class="divider-max-width m-auto"><el-divider class="my-4" /></div>
          <div v-if="sinks.length" class="">
            <div v-for="sink in sinks" :key="sink.id" class="mt-1 flex justify-between">
              <div>
                <span>{{ sink.sink_item_type | getLabelFromStr }}:</span>
                <span class="sinkNumber ml-2 mr-1 text-xl">-{{ sink.total }}</span><span class="text-md">{{ sink.currency_type | getLabelFromStr }}</span>
              </div>
              <div class="text-md text-filter">{{ sink.createdAt }}</div>
            </div>
          </div>
          <div v-else class="u-noData">No data</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSourcesAndSinks } from '@/api/user-management'
import { getLabelFromStr } from '@/utils/format'
import { pickerOptions, init7Days } from '@/utils/helpers/calendar'

export default {
  name: 'SourcesSinks', filters: { getLabelFromStr },
  data() {
    return {
      pickerOptions,
      rangeDate: init7Days(),
      // totalSinks: 0,
      // totalSources: 0,
      sinks: [],
      sources: []
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      const userId = this.$route.params.id
      const [startDate, endDate] = this.rangeDate
      const params = {
        from: startDate,
        to: endDate,
        id: userId
      }
      getSourcesAndSinks(params).then(res => {
        console.log('getSourcesAndSinks :>> ', res)
        this.sinks = res.data?.sinks || []
        this.sources = res.data?.sources || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .sourceNumber {
    color: #67C23A;
  }
  .sinkNumber {
    color: #F56C6C;
  }
  .divider-max-width {
    max-width: 350px;
  }
  .custom-height {
    max-height: 500px;
    overflow-y: auto;
  }
</style>
