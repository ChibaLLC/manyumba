<template>
  <UContainer class="flex gap-2 mt-8 h-full">
    <Title>Listings</Title>
    <aside>
      <div class="tweaks-container">
        <UButton leading-icon="local:sleek-dollar" trailing-icon="local:sleek-arrow-down">Price</UButton>
        <UButton leading-icon="local:sleek-box" trailing-icon="local:sleek-arrow-down">Type</UButton>
        <UButton leading-icon="local:sleek-bed" trailing-icon="local:sleek-arrow-down">Beds</UButton>
        <UButton leading-icon="local:sleek-shower" trailing-icon="local:sleek-arrow-down">Baths</UButton>
        <UButton icon="local:marimba-settings" />
      </div>
      <div class="properties-container">

      </div>
    </aside>
    <main class="map-container">
      <Map class="h-full" />
    </main>
  </UContainer>
</template>
<style scoped>
.tweaks-container {
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  padding: calc(var(--spacing) * 2.5);
  display: flex;
  gap: 0.75rem;
}

.tweaks-container :deep(button) {
  color: black;
  background-color: var(--color-grey);
  padding: calc(var(--spacing) * 2);
  border-radius: 4px;
  width: 7rem;
  justify-content: space-evenly;
}

.tweaks-container :deep(button):last-child {
  width: initial;
}

.tweaks-container :deep(button) .icon:nth-child(2) {
  width: 15px;
  height: 15px;
}

.map-container {
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  width: 100%;
  height: 80vh;
  padding: calc(var(--spacing) * 2);
}
</style>
