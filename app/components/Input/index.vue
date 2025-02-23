<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

const model = defineModel();
const focus = ref(false);
const input = ref<HTMLInputElement | undefined>();
const icon = ref<HTMLElement | undefined>();

const controller = new AbortController();
watch(
    input,
    (el) => {
        if (!el || !icon.value) return;
        const { paddingLeft, paddingBottom, paddingTop, height } = getComputedStyle(el);
        icon.value.style.setProperty("--margin-top", paddingTop);
        icon.value.style.setProperty("--margin-left", paddingLeft);
        icon.value.style.setProperty("--margin-bottom", paddingBottom);
        icon.value.style.setProperty("--height", height);
        icon.value.style.display = 'initial'

        el.addEventListener("blur", () => {
            focus.value = false
        }, { signal: controller.signal });
        el.addEventListener("focus", () => {
            focus.value = true
        }, { signal: controller.signal });

        if (icon.value.children.length) {
            el.classList.add('pl-11')
        }
    },
    { immediate: true }
);

onUnmounted(controller.abort);

watch(focus, (val) => {
    if (!input.value) return
    if (!icon.value?.children.length) return
    if (val) {
        input.value.classList.remove('pl-11')
    } else {
        input.value.classList.add('pl-11')
    }
}, { immediate: true })

const showIcon = computed(() => !icon.value || (model.value || focus.value))
</script>
<template>
    <div class="relative isolate">
        <div ref="icon" class="absolute z-10 icon" :style="{ display: showIcon ? 'none' : 'initial' }">
            <slot></slot>
        </div>
        <input ref="input" v-model="model" v-bind="$attrs" class="bg-white/80 backdrop-blur"
            style="box-shadow: 0px 2px 4px rgba(61, 90, 128, 0.15), inset 0px 2px 4px rgba(188, 190, 192, 0.15)" />
    </div>
</template>
<style scoped>
.icon>* {
    height: var(--height);
    margin-top: var(--margin-top);
    margin-left: var(--margin-left);
    margin-bottom: var(--margin-bottom);
    aspect-ratio: 1/1;
}

.icon *,
.icon *::placeholder {
    color: #9ca3af;
}
</style>
