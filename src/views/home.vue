<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <Vocabulary/>
    </div>
  </div>
</template>

<script>

import Vocabulary from '@/views/LargeScreen/vocabulary'


export default {
  name: 'Dashboard',
  components: {
    Vocabulary
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  height: 91.1vh;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
