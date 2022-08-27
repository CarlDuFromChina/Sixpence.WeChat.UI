<template>
  <admin ref="admin">
  </admin>
</template>

<script>
import { admin } from './core';

export default {
  name: 'myAdmin',
  components: { admin },
  methods: {
    handleClick(cmd) {
      if (cmd && typeof cmd === 'function') {
        cmd();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.hover-menu {
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 10;
}
</style>
