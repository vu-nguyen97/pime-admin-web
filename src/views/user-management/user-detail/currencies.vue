<template>
  <div v-if="currencies" class="p-6 bg-white shadow-lg rounded border mt-6">
    <div class="p-sectionTitle">Currencies</div>
    <div class="ListCurrency">
      <div v-for="(value, crrStat) in currencies" :key="crrStat" class="statsBg p-2 rounded text-center shadow">
        <div class="">{{ crrStat | statFilter }}
          <el-dropdown class="fr cursor-pointer" trigger="click" @command="e => onClickCurrency(e, crrStat)">
            <i class="pi pi-ellipsis-v text-sm" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-minus" command="minus">Minus {{ crrStat }}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus" command="plus">Plus {{ crrStat }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="mt-3 number">{{ value | numberWithCommas }}</div>
      </div>
    </div>
    <el-dialog
      :title="actionLabel + ' ' + stat"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <span class="mr-3">Enter a number:</span>
      <el-input-number v-model="total" controls-position="right" :min="0" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">Cancel</el-button>
        <el-button size="small" type="primary" @click="handleChange">{{ actionLabel }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { capitalizeWord } from '@/utils/format'
import { numberWithCommas } from '@/utils/helper'
import { changeCurrency } from '@/api/user-management'

export default {
  name: 'Currencies',
  filters: {
    statFilter: function(code) {
      return capitalizeWord(code)
    },
    numberWithCommas
  },
  props: {
    currencies: {
      type: Object,
      default() { return {} }
    }
  },
  data() {
    return {
      dialogVisible: false,
      actionLabel: '',
      action: '',
      stat: '',
      total: 0
    }
  },
  methods: {
    onClickCurrency(action, stat) {
      let actionLabel = 'Plus'
      if (action === 'minus') {
        actionLabel = 'Minus'
      }

      this.dialogVisible = true
      this.actionLabel = actionLabel
      this.action = action
      this.stat = stat
    },
    handleChange() {
      const { stat, action, total } = this
      const params = {
        account_id: this.$route.params.id,
        currency_type: stat.toUpperCase(),
        total
      }

      if (action === 'minus') {
        params.total = '-' + params.total
      }

      changeCurrency(params).then(() => {
        const { total, stat, action, currencies } = this

        const newCurrencies = currencies
        let message = 'You have successfully added ' + total + ' ' + stat + ' to this account.'
        if (action === 'minus') {
          message = 'You have successfully reduced ' + total + ' ' + stat + ' from this account'
          newCurrencies[stat] = newCurrencies[stat] - total
        } else {
          newCurrencies[stat] = newCurrencies[stat] + total
        }

        this.$message({ message, type: 'success' })
        this.$emit('updateCurrency', newCurrencies)
        this.closeModal()
      })
    },
    closeModal() {
      this.total = 0
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
