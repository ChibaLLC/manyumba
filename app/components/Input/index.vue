<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const model = defineModel<number | string | undefined>();
const focus = ref(false);
const showIcon = computed(() => !focus.value && !model.value?.toString()?.length);
</script>
<template>
  <div class="relative isolate spaced">
    <div ref="icon" class="absolute z-10 top-1/2 transform -translate-y-1/2 icon" v-if="showIcon">
      <slot></slot>
    </div>
    <input
      ref="input"
      v-model="model"
      v-bind="$attrs"
      @blur="focus = false"
      @focus="focus = true"
      class="bg-white/80 backdrop-blur focus:outline-none"
      style="
        box-shadow:
          0px 2px 4px rgba(61, 90, 128, 0.15),
          inset 0px 2px 4px rgba(188, 190, 192, 0.15);
      "
    />
  </div>
</template>
<style scoped>
.icon {
  --height: calc(var(--spacing) * 6);
  --margin-left: calc(var(--spacing) * 2);
}

.icon > * {
  height: var(--height);
  margin-left: var(--margin-left);
  aspect-ratio: 1/1;
}

.icon *,
.icon *::placeholder {
  color: #9ca3af;
}

.spaced:has(.icon > *) input {
  padding-left: calc(var(--spacing) * 9);
}
</style>
