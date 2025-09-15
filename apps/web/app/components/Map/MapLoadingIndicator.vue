<template>
  <div v-if="loading">Loading...</div>
</template>
<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>
