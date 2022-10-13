<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">      
      <el-table-column min-width="350px" align="center" label="Small blind">
        <template slot-scope="{row}">
          {{row.smallBlind}}
        </template>
      </el-table-column>  
      <el-table-column min-width="350px" align="center" label="Big blind">
        <!-- <template slot-scope="{row}">
          {{row.bigBlind}}
        </template> -->
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
          <span v-else>{{ row.bigBlind }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Buy-in">
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
          <span v-else>{{ row.buyIn }}</span>
        </template>
      </el-table-column>
      
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
// import { fetchList } from '@/api/article'
import { fetchList, update } from '@/api/games/poker-api'

export default {
  name: 'Games-Poker-BlindLevels',
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
        v.edit = false
        v.smallBlind = v.bigBlind / 2
        v.originBigBlind = v.bigBlind
        v.originBuyIn = v.buyIn
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.bigBlind = row.originBigBlind
      row.smallBlind = row.bigBlind / 2
      row.buyIn = row.originBuyIn

      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {

      if ( -1 < row.bfc) {
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
      }else{
        this.$message({
          message: 'BFC reward must be greater than 0',
          type: 'error'
        })
        row.bfc = row.originBFC
      }        
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
