<template>
  <sp-list :controller-name="controllerName" :operations="operations" :columns="columns"></sp-list>
</template>

<script>
export default {
  name: 'focusUserList',
  data() {
    return {
      controllerName: 'wechat_user',
      operations: ['search'],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'openid', label: 'openid' },
        { prop: 'nickname', label: '用户昵称' },
        { prop: 'sex', label: '性别' },
        { prop: 'subscribe_time', label: '关注时间', type: 'datetime' }
      ]
    };
  }
}
</script>

<style>

</style>