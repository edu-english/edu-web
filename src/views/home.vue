<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <Vocabulary v-show="shouPage"/>
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
      shouPage: true
    }
  },
  mounted() {
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      this.shouPage = false
      this.$router.push({path: '/phone/classroom'})
    } else {
      this.shouPage = true
    }
  },
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
