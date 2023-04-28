<template>
  <div class="DetailUser">
    <!-- <div>
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
      <el-button type="primary" class="ml-2" @click="handleSearch">Search</el-button>
    </div> -->
    <div v-if="Object.keys(user).length" class="">
      <el-row :gutter="40" class="text-md">
        <el-col :span="10" :lg="6">
          <div class="p-6 bg-white shadow-lg rounded">
            <div class="flex"><div class="formLabel lg">Username:</div><div class="font-bold formValue">{{ user.username }}</div></div>
            <div class="flex mt-3"><div class="formLabel lg">Display:</div><div class="formValue">{{ user.display_name }}</div></div>
            <div class="flex mt-3"><div class="formLabel lg">Email:</div><div class="formValue">{{ user.email }}</div></div>
            <el-divider class="my-5" />
            <div class="flex"><div class="formLabel">Banned</div><div class="formValue">{{ hasBanStatus ? user.ban_status.banned : 'false' }}</div></div>
            <div class="flex mt-3"><div class="formLabel">Sex:</div><div class="formValue">{{ user.sex }}</div></div>
            <div class="flex mt-3"><div class="formLabel">Created at:</div><div class="formValue">{{ user.created_at | moment }}</div></div>
            <div class="flex mt-3"><div class="formLabel">Updated at:</div><div class="formValue">{{ user.updated_at | moment }}</div></div>
            <el-divider class="my-5" />
            <div class="flex"><div class="formLabel">Country</div>
              <template v-if="user.country">
                <span :class="`fi fi-${user.country.toLowerCase()}`" />
                <span class="ml-2">{{ user.country | countryFilter }}</span>
                <span class="ml-1"> ({{ user.country }})</span>
              </template>
            </div>
            <div class="flex mt-3"><div class="formLabel">App version</div><div class="formValue">{{ user.app_version }}</div></div>
          </div>
        </el-col>
        <el-col :span="14" :lg="18">
          <div v-if="user.stats" class="p-6 bg-white shadow-lg rounded border">
            <div class="p-sectionTitle">Stats</div>
            <div class="ListStat">
              <div v-for="(value, stat) in user.stats" :key="stat" class="statsBg p-2 rounded text-center shadow">
                <div class="">{{ stat | statFilter }}</div>
                <div class="mt-2 number">{{ value }}</div>
              </div>
            </div>
          </div>
          <div v-if="user.currency" class="p-6 bg-white shadow-lg rounded border mt-6">
            <div class="p-sectionTitle">Currencies</div>
            <div class="ListCurrency">
              <div v-for="(value, stat) in user.currency" :key="stat" class="statsBg p-2 rounded text-center shadow">
                <div class="">{{ stat | statFilter }}</div>
                <div class="mt-2 number">{{ value }}</div>
              </div>
            </div>
          </div>
          <ban-user :user="user" @updateUser="updateUser" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getUser, getSourcesAndSinks } from '@/api/user-management'
import { getCountryNameFromCode } from '@/utils/helper'
import { capitalizeWord } from '@/utils/format'
import { pickerOptions, init7Days } from '@/utils/helpers/calendar'
import BanUser from './ban-user.vue'

export default {
  name: 'UserDetail',
  components: {
    BanUser
  },
  filters: {
    countryFilter: function(code) {
      return getCountryNameFromCode(code)
    },
    statFilter: function(code) {
      return capitalizeWord(code)
    },
    moment: function(date) {
      if (!date) return ''
      return moment(date).format('DD-MM-YYYY, HH:mm')
    }
  },
  data() {
    return {
      user: {},
      hasBanStatus: false,
      pickerOptions,
      rangeDate: init7Days(),
      totalSinks: 0,
      totalSources: 0,
      sinks: [],
      sources: []
    }
  },
  created() {
    const userId = this.$route.params.id
    // const [startDate, endDate] = this.rangeDate
    // const params = {
    //   from: startDate,
    //   to: endDate,
    //   id: userId
    // }

    Promise.all([getUser(userId), getSourcesAndSinks({ id: userId })]).then((res) => {
      const userData = res[0].data
      console.log('>>>>>', res[1]) // split comp

      if (!userData) return

      this.user = userData
      const banStatus = Object.keys(userData).includes('ban_status')
      this.hasBanStatus = banStatus
    })
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
        this.sinks = res.data?.sinks || []
        this.sources = res.data?.sources || []
      })
    },
    updateUser(newData) {
      this.user = newData
    }
  }
}
</script>

<style lang="scss" scoped>
  .DetailUser {
    background-color: rgba(#e3e8ee, 0.3);
    padding: 30px;
    min-height: 100vh;

    $width: 140px;
    .formLabel {
      font-size: 14px;
      width: $width;
      &.lg {
        font-size: 15px;
      }
    }

    .formValue {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: calc(100% - #{$width});
    }

    // .formTitle {
    //   font-size: 16px;
    //   font-weight: 600;
    //   width: $width;
    // }

    .ListStat, .ListCurrency {
      margin-left: -0.5rem;
      margin-right: -0.5rem;
      display: flex;
      justify-content: space-between;
    }

    .statsBg {
      background-color: #f8fafc;
      margin: 0.5rem 0.5rem 0;
      width: 100px;
    }

    .ListCurrency .statsBg {
      width: 150px;
    }

    .number {
      font-size: 22px;
      font-weight: 600;
      color: #42b983;
    }
  }
</style>
