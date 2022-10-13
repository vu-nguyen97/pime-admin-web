<template>
  <div class="app-container">
    <div class="list-chart-container">
      <div id="UsersChart" :class="className" :style="{height:height, width:width}" />
      <div id="TotalMatchesChart" :class="className" :style="{height:height, width:width}" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/infographic')
import { getCCU } from '@/api/configs/stats'
import resize from '../dashboard/admin/components/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart custom-chart'
    },
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      intervId: null,
      usersChart: null,
      usersData: {
        cryptoUsers: [0],
        freeUsers: [0],
        totalUsers: [0]
      },
      totalMatchesChart: null,
      totalMatchesData: [0]
    }
  },
  created() {
    this.drawChart(true)
  },
  beforeDestroy() {
    clearInterval(this.intervId)
    this.clearCharts()
  },
  unmounted() {
    clearInterval(this.intervId)
  },
  methods: {
    checkValidData(inputData) {
      return inputData > 0 ? inputData : 0
    },
    drawChart(isInit = false) {
      getCCU().then(res => {
        if (!res.data) return

        const { cryptoUsers, freeUsers, totalMatches, totalUsers } = res.data
        this.usersData.cryptoUsers.push(this.checkValidData(cryptoUsers))
        this.usersData.freeUsers.push(this.checkValidData(freeUsers))
        this.usersData.totalUsers.push(this.checkValidData(totalUsers))
        this.totalMatchesData.push(this.checkValidData(totalMatches))
        this.initChart()

        if (isInit) {
          this.intervId = setInterval(async() => {
            this.clearCharts()
            await this.drawChart()
          }, 10000)
        }
      }, () => {})
    },
    clearCharts() {
      if (this.cryptoUsersChart || this.freeUsersChart || this.totalMatchesChart || this.totalUsersChart) {
        this.cryptoUsersChart?.dispose()
        this.freeUsersChart?.dispose()
        this.totalMatchesChart?.dispose()
        this.totalUsersChart?.dispose()
        this.cryptoUsersChart = null
        this.freeUsersChart = null
        this.totalMatchesChart = null
        this.totalUsersChart = null
      }
    },
    initChart() {
      this.usersChart = echarts.init(document.getElementById('UsersChart'), 'infographic')
      this.usersChart.setOption(
        this.getChartConfig(Object.values(this.usersData),
          ['Crypto Users', 'Free Users', 'Total Users'])
      )

      this.totalMatchesChart = echarts.init(document.getElementById('TotalMatchesChart'), 'infographic')
      this.totalMatchesChart.setOption(this.getChartConfig(this.totalMatchesData, ['Total Matches']))
    },
    getChartConfig(chartData, legendArr, maxData = 10) {
      if (!chartData?.length) return

      const symbolSize = 6
      let series = []

      if (typeof chartData[0][0] === 'undefined') {
        series = [
          {
            name: legendArr[0],
            data: chartData,
            symbolSize,
            label: { show: chartData.length < maxData },
            type: 'line'
          }
        ]
      } else {
        // chartData is multidimensional array
        chartData.forEach((lineData, id) => {
          series.push({
            name: legendArr[id],
            data: lineData,
            symbolSize,
            label: { show: lineData.length < maxData },
            type: 'line'
          })
        })
      }

      return {
        xAxis: {
          axisLabel: {
            fontSize: 15,
            color: '#0e0e0e'
          },
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: true
          }
        },
        legend: { data: legendArr },
        series
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-chart-container {
    display: flex;
    flex-wrap: wrap;
  }

  .custom-chart {
    margin-top: 2rem;
  }
</style>
