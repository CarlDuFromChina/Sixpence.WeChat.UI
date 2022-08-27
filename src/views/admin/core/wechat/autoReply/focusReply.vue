<template>
  <a-card :bordered="false">
    <slot name="title">
      <p>
        通过编辑内容或关键词规则，快速进行自动回复设置。
        <a-switch default-checked style="float: right" />
      </p>
    </slot>
    <sp-editor ref="editor" v-model="content" :enableMenu="['image', 'video']"></sp-editor>
    <a-button type="primary" style="margin-top: 20px" @click="saveData"> 保存 </a-button>
    <a-button type="danger" @click="reset"> 清空 </a-button>
  </a-card>
</template>

<script>
export default {
  name: 'focusReply',
  data() {
    return {
      content: '',
      controllerName: 'wechat_focus_reply'
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.content = await sp.get(`api/${this.controllerName}`);
    },
    async saveData() {
      const url = `api/${this.controllerName}`;
      try {
        await sp.put(url, { text: this.$refs.editor.editor.txt.text() });
        this.$message.success('保存成功');
      } catch (error) {
        this.$message.error('保存失败');
      }
    },
    reset() {
      this.content = '';
      this.saveData();
    }
  }
};
</script>

<style></style>
