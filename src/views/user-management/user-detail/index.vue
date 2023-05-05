<template>
  <div class="DetailUser">
    <div v-if="Object.keys(user).length" class="">
      <el-row :gutter="40" class="text-md">
        <el-col :span="10" :lg="6">
          <div class="p-6 bg-white shadow-lg rounded border">
            <div class="flex justify-between">
              <div v-if="user.profile_image_url" class="avatar relative rounded-circle overflow-hidden">
                <img :src="user.profile_image_url" alt=" " class="img-cover rounded-circle border shadow-lg h-full w-full">
                <span class="downloadEl hidden">
                  <i class="pi pi-download text-white cursor-pointer" @click="downloadAvt" />
                </span>
              </div>
              <div v-else class="default-avt shadow"><svg-icon icon-class="imageOff" class="avt-icon" /></div>
              <div class="flex items-end mb-2">
                <send-message :username="user.username" />
              </div>
            </div>
            <div class="mt-5">
              <div class="textLabel text-sm">Username</div>
              <div class="text-lg font-bold formValue">{{ user.username }}</div>
            </div>
            <div class="mt-4">
              <div class="textLabel text-sm">Display</div>
              <div class="formValue">{{ user.display_name }}</div>
            </div>
            <div class="mt-4">
              <div class="textLabel text-sm">Email</div>
              <div class="formValue">{{ user.email }}</div>
            </div>
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
          <div v-if="userStats" class="p-6 bg-white shadow-lg rounded border">
            <div class="p-sectionTitle">Stats</div>
            <div class="ListStat">
              <div v-for="(value, stat) in userStats" :key="stat" class="statsBg p-2 rounded text-center shadow">
                <div class="">{{ stat | statFilter }}</div>
                <div class="mt-2 number">{{ value }}</div>
              </div>
            </div>
          </div>
          <currencies :currencies="user.currency" @updateCurrency="handleUpdateCurrency" />
          <sources-sinks :update-key="updateKey" />
          <ban-user :user="user" @updateUser="updateUser" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getUser } from '@/api/user-management'
import { getCountryNameFromCode } from '@/utils/helper'
import { capitalizeWord } from '@/utils/format'
import BanUser from './ban-user.vue'
import SourcesSinks from './sources-sinks.vue'
import Currencies from './currencies.vue'
import SendMessage from './send-message.vue'
import { numberWithCommas } from '@/utils/helper'

export default {
  name: 'UserDetail',
  components: { BanUser, SourcesSinks, Currencies, SendMessage },
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
    },
    numberWithCommas
  },
  data() {
    return {
      user: {},
      userStats: {},
      hasBanStatus: false,
      updateKey: 1
    }
  },
  created() {
    const userId = this.$route.params.id

    getUser(userId).then((res) => {
      const userData = res.data
      if (!userData) return

      this.user = userData

      const newStat = {}
      const statData = userData.stats || {}
      const orderedStats = ['strength', 'speed', 'luck', 'intelligence', 'level', 'exp', 'famous', 'energy', 'hunger']
      orderedStats.forEach(stat => {
        newStat[stat] = statData[stat]
      })
      this.userStats = newStat

      const banStatus = Object.keys(userData).includes('ban_status')
      this.hasBanStatus = banStatus
    })
  },
  methods: {
    updateUser(newData) {
      this.user = newData
    },
    handleUpdateCurrency(newCrr) {
      this.user.currency = newCrr

      // Update sources & sinks
      this.updateKey = this.updateKey + 1
    },
    downloadAvt() {
      window.open(this.user?.profile_image_url, '_blank').focus()
    }
  }
}
</script>

<style lang="scss">
  .DetailUser {
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
      width: 180px;
    }

    .number {
      font-size: 22px;
      font-weight: 600;
      color: #42b983;
    }
  }
</style>

<style lang="scss" scoped>
  .DetailUser {
    padding: 30px;
    min-height: 100vh;

    .avatar {
      height: 110px;
      width: 110px;
    }

    .default-avt {
      position: relative;
      border-radius: 50%;
      background-color: #ededed;
      width: 80px;
      height: 80px;

      .avt-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 20px;
        height: 20px;
      }
    }

    @keyframes move {
      0% {
        opacity: 0;
        height: 0;
      }
      100% {
        opacity: 1;
        height: 32px;
      }
    }

    .downloadEl {
      animation: move 0.35s ease-out forwards;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(black, 0.3);
      justify-content: center;
      align-items: center;
    }

    .avatar:hover .downloadEl {
      display: flex;
    }

    .textLabel {
      color: #d0d0d0;
      margin-bottom: 2px;
    }

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
  }
</style>
