<template>
  <el-dialog :title="Object.keys(editedData).length ? `Edit ${editedData.id}` :'Add item' " :visible.sync="isOpen" width="600px" :before-close="closeModal">
    <el-form v-if="isOpen" ref="addItemForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="Id" prop="id">
        <el-input v-model="form.id" placeholder="Enter a id" :disabled="Object.keys(editedData).length > 0" />
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-select v-model="form.category" placeholder="Select a type" class="w-full" clearable>
          <el-option
            v-for="item in categoryOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Item type" prop="activedType">
        <el-select v-model="form.activedType" placeholder="Select a type" class="w-full" clearable>
          <el-option
            v-for="item in typeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="How to get" prop="activedGetterType">
        <el-select v-model="form.activedGetterType" multiple placeholder="Select a type" class="w-full" clearable>
          <el-option
            v-for="item in getterTypeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Rarity" prop="activedRarity">
        <el-select v-model="form.activedRarity" placeholder="Select a rarity" class="w-full" clearable>
          <el-option
            v-for="item in rarityOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Form" prop="form">
        <el-input-number v-model="form.form" controls-position="right" :min="1" class="w-full" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">Cancel</el-button>
      <el-button type="primary" @click="submitForm('addItemForm')">{{ Object.keys(editedData).length ? "Edit" : "Add" }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLabelFromStr } from '@/utils/format'
import { createItem, editItem } from '@/api/default-items'
import { ITEM_GETTER_TYPES, RARITIES } from '@/constants/dropdowns'
import { getDrdFromObj } from '@/utils/helper'
import { ADD_SUCCESS_MESS, EDIT_SUCCESS_MESS } from '@/constants/messages'
import { INPUT_REQUIRED, SELECT_REQUIRED, NUMBER_REQUIRED } from '@/constants/validate'
import { getActivedType } from '@/utils/helper'

export default {
  name: 'ModalAdd',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    editedData: {
      type: Object,
      default() { return {} }
    },
    categoryData: {
      type: Array,
      default() { return [] }
    },
    updateTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      typeOpts: [],
      getterTypeOpts: getDrdFromObj(ITEM_GETTER_TYPES),
      rarityOpts: getDrdFromObj(RARITIES),
      categoryOpts: this.categoryData.map(el => {
        return { label: getLabelFromStr(el.category), value: el.category }
      }),
      form: {
        id: '',
        category: null,
        activedType: null,
        activedGetterType: [],
        activedRarity: null,
        form: 1
      },
      rules: {
        id: [{ required: true, message: INPUT_REQUIRED, trigger: 'blur' }],
        category: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        activedType: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        activedGetterType: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        activedRarity: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        form: [{ required: true, message: NUMBER_REQUIRED, trigger: 'change' }]
      }
    }
  },
  watch: {
    'form.category': function(val, oldVal) {
      this.typeOpts = getActivedType(this.categoryData, val)

      if (oldVal) {
        this.form.activedType = null
      }
    }
  },
  created() {
    if (Object.keys(this.$props.editedData).length) {
      const { form, how_to_gets, id, stats, type, category } = this.$props.editedData
      this.form = {
        id,
        activedType: type,
        activedGetterType: how_to_gets,
        activedRarity: stats?.rarity,
        category,
        form
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal')
      this.resetForm('addItemForm')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (Object.keys(this.$props.editedData).length) {
            this.handleEdit()
          } else {
            this.handleAdd()
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getParams() {
      const { id, activedType, activedGetterType, activedRarity, form, category } = this.form
      const params = {
        id,
        form,
        category: category,
        type: activedType,
        how_to_gets: activedGetterType,
        stats: {
          rarity: activedRarity
        }
      }
      return params
    },
    handleAdd() {
      const params = this.getParams()

      createItem(params).then(res => {
        this.$message({ type: 'success', message: ADD_SUCCESS_MESS })
        this.$emit('updateTableData', 'add', res.data)
        this.closeModal()
      }, () => {})
    },
    handleEdit() {
      const params = this.getParams()

      editItem(params).then(res => {
        this.$message({ type: 'success', message: EDIT_SUCCESS_MESS })
        this.$emit('updateTableData', 'edit', res.data)
        this.closeModal()
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
