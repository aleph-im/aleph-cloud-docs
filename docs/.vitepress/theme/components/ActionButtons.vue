<template>
  <div class="inline-action-buttons">
    <slot></slot>
  </div>
</template>

<script setup>
// No props or logic needed, just a wrapper component
</script>

<style>
.inline-action-buttons {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;
  padding: 24px 0;
}

.inline-action-buttons :deep(.action-button) {
  margin: 6px;
}
</style>
