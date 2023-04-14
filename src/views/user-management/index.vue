<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="All User" lazy>
        <list-user />
      </el-tab-pane>
      <el-tab-pane label="Top User" lazy>
        <top-user />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TopUser from './top-user.vue'
import ListUser from './list-user.vue'

export default {
  name: 'UserManagement',
  components: { TopUser, ListUser }
}
</script>

<style lang="scss" scoped>

</style>
