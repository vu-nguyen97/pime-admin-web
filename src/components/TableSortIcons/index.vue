<template>
  <div class="u-tableSorts" @click="sortFunc">
    {{ fieldLabel || field | getLabelFromStr }}
    <span class="u-tableSorts-icons">
      <i :class="['sort-caret ascending', {'actived': sortData[field] === '+' }]" @click="sortAsc" />
      <i :class="['sort-caret descending', {'actived': sortData[field] === '-' }]" @click="sortDesc" />
    </span>
    <div v-if="hasSearch">
      <el-popover v-model="showPopover" width="200">
        <el-input ref="tableSearchRef" v-model="search" size="mini" placeholder="Type here to search" />
        <div class="mt-2 flex">
          <el-button size="mini" class="w-50" @click="handleReset">Reset</el-button>
          <el-button type="primary" size="mini" class="w-50" @click="handleSearch">Search</el-button>
        </div>
        <i slot="reference" :class="['pi pi-filter-fill pi-sm custom-margin p-2 pl-i0', isFiltered ? 'text-primary' : 'text-filter']" @click="openSearch" />
      </el-popover>
    </div>
  </div>
</template>

<script>
import { SORT_STATUS, ASC, DESC, SORTABLE } from '@/constants/constants'

export default {
  name: 'TableSortIcons',
  props: {
    field: {
      type: String,
      required: true
    },
    fieldLabel: {
      type: String,
      default: ''
    },
    tableRef: {
      type: String,
      required: true
    },
    hasSearch: {
      type: Boolean,
      default: false
    },
    sortData: { // chứa thông tin sort theo field
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    searchData: { // chứa các text cần search theo field
      type: Object,
      default() {
        return {}
      }
    },
    self: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isFiltered: false,
      search: '',
      showPopover: false
    }
  },
  methods: {
    sortFunc() {
      const { self, field, tableRef } = this
      const crrType = self.sortData[field]

      if (crrType) {
        const idx = SORT_STATUS.findIndex(el => el === crrType)
        const nextTypeIdx = idx === SORT_STATUS.length - 1 ? 0 : idx + 1
        const nextStatus = SORT_STATUS[nextTypeIdx]

        if (nextStatus === SORTABLE) {
          const newSortData = self.sortData
          delete newSortData[field]
          self.sortData = { ...newSortData }
        } else {
          self.sortData = { ...self.sortData, [field]: nextStatus }
        }
      } else {
        self.sortData = { ...self.sortData, [field]: ASC }
      }

      self.$refs[tableRef].$refs.tableHeader.$forceUpdate()
    },
    sortDesc(event) {
      const { self, field, tableRef } = this
      const crrType = self.sortData[field]

      if (crrType === SORTABLE || crrType === ASC) {
        self.sortData = { ...self.sortData, [field]: DESC }
      } else {
        const newSortData = self.sortData
        delete newSortData[field]
        self.sortData = { ...newSortData }
      }

      event.stopPropagation()
      self.$refs[tableRef].$refs.tableHeader.$forceUpdate()
    },
    sortAsc(event) {
      const { self, field, tableRef } = this
      const crrType = self.sortData[field]

      if (crrType === SORTABLE || crrType === DESC) {
        self.sortData = { ...self.sortData, [field]: ASC }
      } else {
        const newSortData = self.sortData
        delete newSortData[field]
        self.sortData = { ...newSortData }
      }

      event.stopPropagation()
      self.$refs[tableRef].$refs.tableHeader.$forceUpdate()
    },
    openSearch(event) {
      event.stopPropagation()
      setTimeout(() => {
        this.$refs['tableSearchRef'].focus()
      }, 100)
    },
    handleReset() {
      const { field, searchData } = this

      this.search = ''
      this.isFiltered = false
      this.showPopover = false

      const newSearchData = { ...searchData, [field]: '' }
      this.$emit('updateSearch', newSearchData)
    },
    handleSearch() {
      const { field, searchData } = this

      this.showPopover = false
      if (!this.search) return

      const newSearchData = { ...searchData, [field]: this.search }
      this.$emit('updateSearch', newSearchData)
      this.isFiltered = true
    }
  }
}
</script>

<style lang="scss" scoped>
.u-tableSorts {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &-icons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    flex-shrink: 0;
    height: 34px;
    width: 24px;

    .sort-caret {
      width: 0;
      height: 0;
      border: solid 5px transparent;
    }

    .ascending {
      border-bottom-color: #C0C4CC;
      &.actived {
        border-bottom-color: #1890ff;
      }
    }
    .descending {
      border-top-color: #C0C4CC;
      &.actived {
        border-top-color: #1890ff;
      }
    }
  }
}

span:has(i.custom-margin) {
  margin-bottom: 1px;
}
</style>
