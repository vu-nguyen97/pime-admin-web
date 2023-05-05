<template>
  <div>
    <el-button icon="el-icon-chat-line-square" circle size="small" title="Send message to the user" @click="dialogVisible = true" />
    <el-dialog
      :title="'Send message to ' + username"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="mb-2">Message:</div>
      <el-input
        v-model="text"
        type="textarea"
        :rows="5"
        placeholder="Please input"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">Cancel</el-button>
        <el-button size="small" type="primary" @click="handleSendMess">Send</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sendMessage } from '@/api/user-management'
import { SEND_MESSAGE_SUCCESS } from '@/constants/messages'

export default {
  name: 'SendMessage',
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: '',
      dialogVisible: false
    }
  },
  methods: {
    handleSendMess() {
      const params = {
        account_id: this.$route.params.id,
        content: this.text
      }

      sendMessage(params).then(res => {
        this.$message({ message: SEND_MESSAGE_SUCCESS, type: 'success' })
        this.closeModal()
      })
    },
    closeModal() {
      this.dialogVisible = false
      this.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
