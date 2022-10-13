<template>
  <div class="app-container">
    <h4 style="margin-top: 0">Upgrade Character:</h4>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabOptions" :key="item.key" :label="item.label" :name="item.key">
        <el-table v-loading="listLoading" :data="tableData" border fit stripe highlight-current-row>
          <el-table-column align="center" label="Level" width="80">
            <template slot-scope="{row}">
              <span>{{ row.level }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Stat" min-width="300">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.value" class="edit-input" size="small" @keypress.native="checkNumber" />
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
              <span v-else>{{ row.value }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Price" min-width="300">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input v-model="row.price" class="edit-input" size="small" @keypress.native="checkNumber" />
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
              <span v-else>{{ row.price }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Actions" width="200">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getStatsInfo, updateStats } from '@/api/configs/upgrade-character'
import { STATS_DATA } from '@/components/Constants'

export default {
  data() {
    return {
      tabOptions: Object.values(STATS_DATA).map(item => {
        return {
          id: item.id,
          label: item.label,
          key: item.name
        }
      }),
      activeName: STATS_DATA.hp.name,
      statsData: [],
      tableData: [],
      listLoading: true
    }
  },
  created() {
    getStatsInfo().then(res => {
      if (!res.data?.items?.length > 0) return

      const listData = res.data.items
      this.tableData = this.getTableData(listData)
      this.statsData = listData
      this.listLoading = false
    }, () => { this.listLoading = false })
  },
  methods: {
    getTableData(listData = this.statsData) {
      return listData.filter(item => item.type === STATS_DATA[this.activeName].id)
        .sort((item1, item2) => item1.level - item2.level)
        .map(item => {
          this.$set(item, 'edit', false)
          item.originalValue = item.value
          item.originalPrice = item.price
          return item
        })
    },
    cancelEdit(row) {
      row.value = row.originalValue
      row.price = row.originalPrice
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false

      updateStats(row).then(() => {
        row.originalValue = row.value
        row.originalPrice = row.price
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      },
      () => { })
    },
    handleClick(tab) {
      this.activeName = tab._props.name
      this.tableData = this.getTableData()
    },
    checkNumber(evt) {
      evt = (evt) || window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode

      if ((charCode < 48 || charCode > 57) && charCode !== 46) {
        evt.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  max-width: 200px;
}
.cancel-btn {
  margin-left: 0.5rem;
}
</style>
