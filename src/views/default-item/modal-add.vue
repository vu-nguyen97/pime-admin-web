<template>
  <el-dialog :title="Object.keys(editedData).length ? `Edit ${editedData.id}` :'Add item' " :visible.sync="isOpen" width="600px" :before-close="closeModal">
    <el-form v-if="isOpen" ref="addItemForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="Id" prop="id">
        <el-input v-model="form.id" placeholder="Enter a id" :disabled="Object.keys(editedData).length > 0" />
      </el-form-item>
      <el-form-item label="Item type" prop="activedType">
        <el-select v-model="form.activedType" placeholder="Select a type" class="w-full">
          <el-option
            v-for="item in typeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="How to get" prop="activedGetterType">
        <el-select v-model="form.activedGetterType" multiple placeholder="Select a type" class="w-full">
          <el-option
            v-for="item in getterTypeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Rarity" prop="activedRarity">
        <el-select v-model="form.activedRarity" placeholder="Select a rarity" class="w-full">
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
import { createItem, editItem } from '@/api/default-items'
import { ITEM_GETTER_TYPES, DEFAULF_ITEM_TYPES, RARITIES } from '@/constants/dropdowns'
import { getDrdFromObj } from '@/utils/helper'
import { ADD_SUCCESS_MESS, EDIT_SUCCESS_MESS } from '@/constants/messages'
import { INPUT_REQUIRED, SELECT_REQUIRED, NUMBER_REQUIRED } from '@/constants/validate'

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
    updateTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      typeOpts: getDrdFromObj(DEFAULF_ITEM_TYPES),
      getterTypeOpts: getDrdFromObj(ITEM_GETTER_TYPES),
      rarityOpts: getDrdFromObj(RARITIES),
      form: {
        id: '',
        activedType: '',
        activedGetterType: [],
        activedRarity: '',
        form: 1
      },
      rules: {
        id: [{ required: true, message: INPUT_REQUIRED, trigger: 'blur' }],
        activedType: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        activedGetterType: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        activedRarity: [{ required: true, message: SELECT_REQUIRED, trigger: 'change' }],
        form: [{ required: true, message: NUMBER_REQUIRED, trigger: 'change' }]
      }
    }
  },
  created() {
    if (Object.keys(this.$props.editedData).length) {
      const { form, how_to_gets, id, stats, type } = this.$props.editedData
      this.form = {
        id,
        activedType: type,
        activedGetterType: how_to_gets,
        activedRarity: stats?.rarity,
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
      const { id, activedType, activedGetterType, activedRarity, form } = this.form
      const params = {
        id,
        form,
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
