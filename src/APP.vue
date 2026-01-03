<template>
  <div id="app" class="app-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  background-color: $bg-dark;
  color: $text-primary;
}
</style>