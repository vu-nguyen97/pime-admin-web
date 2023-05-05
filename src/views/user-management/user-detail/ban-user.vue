<template>
  <el-collapse v-model="collapseBan" class="shadow-lg rounded mt-6">
    <el-collapse-item name="1" :disabled="hasBanStatus && user.ban_status.banned">
      <template slot="title">
        <div v-if="hasBanStatus && user.ban_status.banned" class="px-6 py-4 hiddenCollapse">
          <div class="p-sectionTitle">Banned reason:
            <span class="text-danger text-xl">{{ user.ban_status.ban_reason | getLabelFromStr }}</span>
          </div>
          <div class="mt-2 text-md">
            <span class="mr-1">(Time:</span> {{ user.ban_status.banned_at | moment }}
            <span class="mx-2">-></span>
            {{ user.ban_status.ban_until | banMoment }})
          </div>
        </div>
        <div v-else class="px-6 p-sectionTitle mt-2">Ban user</div>
      </template>
      <div class="px-6 border-t">
        <div class="flex items-center mt-6">
          <div class="banFormLabel">Reason:</div>
          <el-select v-model="activedReason" placeholder="Select a reason" clearable class="w-250">
            <el-option
              v-for="item in banReasons"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="mt-2">
          <span class="banFormLabel">Ban forever:</span>
          <el-switch v-model="banForever" />
        </div>
        <div v-if="!banForever" class="mt-2">
          <span class="banFormLabel">Ban time:</span>
          <span class="mr-2">Days:</span>
          <el-input-number v-model="time.days" :min="0" :controls="false" size="small" class="u-inputNumber-xs" />
          <span class="ml-6 mr-2">Hours:</span>
          <el-input-number v-model="time.hours" :min="0" :controls="false" size="small" class="u-inputNumber-xs" />
          <span class="ml-6 mr-2">Minutes:</span>
          <el-input-number v-model="time.minutes" :min="0" :controls="false" size="small" class="u-inputNumber-xs" />
        </div>
        <el-button :disabled="!activedReason" type="danger" class="mt-4 btnBanWidth" @click="handleBan">Ban</el-button>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import moment from 'moment'
import { BAN_SUCCESS } from '@/constants/messages'
import { getLabelFromStr } from '@/filters/index'
import { getBanReasons, banUser } from '@/api/user-management'

export default {
  name: 'BanUser',
  filters: {
    moment: function(date) {
      if (!date) return ''
      return moment(date).format('DD-MM-YYYY, HH:mm')
    },
    banMoment: function(date) {
      if (date === 0) return 'forever'
      return moment(date).format('DD-MM-YYYY, HH:mm')
    }
  },
  props: {
    user: {
      type: Object,
      default() { return {} }
    }
  },
  data() {
    return {
      hasBanStatus: false,
      collapseBan: [],
      banReasons: [],
      activedReason: null,
      banForever: false,
      time: { days: 0, hours: 0, minutes: 0 }
    }
  },
  created() {
    getBanReasons().then(res => {
      this.banReasons = res.data.map(el => {
        return { label: getLabelFromStr(el), value: el }
      })
    })

    const userData = this.user
    if (!userData) return

    const banStatus = Object.keys(userData).includes('ban_status')
    this.hasBanStatus = banStatus

    if (!banStatus || !userData.ban_status.banned) {
      this.collapseBan = ['1']
    }
  },
  methods: {
    handleBan() {
      const { user, activedReason, banForever, time } = this
      const { days, hours, minutes } = time
      const params = {
        account_id: user.id,
        ban_reason: activedReason,
        ban_forever: banForever,
        days,
        hours,
        minutes
      }

      banUser(params).then(res => {
        this.$message({ message: BAN_SUCCESS, type: 'success' })
        this.$emit('updateUser', res.data)
        this.hasBanStatus = true
        this.collapseBan = []
      })
    }
  }
}
</script>

<style lang="scss">
.DetailUser {
  .el-collapse {
    // border: 0;
    border-radius: 0.25rem;
  }

  .el-collapse-item__header {
    height: 60px;
    border: 0;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;

    .el-collapse-item__arrow {
      margin-right: 24px;
      font-size: 18px;
    }

    &:has(.hiddenCollapse) {
      line-height: normal;
      height: 90px;

      .el-collapse-item__arrow {
        display: none;
      }
    }

    &:not(.is-active) {
      border-radius: 0.25rem;
    }
  }

  .el-collapse-item__wrap {
    border: 0 !important;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
}
</style>

<style lang="scss" scoped>
  .w-250 {
    width: 250px;
  }

  .btnBanWidth {
    width: 100px;
  }

  .banFormLabel {
    width: 180px;
    display: inline-block;
    font-size: 14px;
  }

  .border-t {
    border-top: 1px solid #e6ebf5;
  }
</style>
