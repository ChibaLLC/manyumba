<template>
  <div
    class="flex justify-between w-full items-center px-10 py-4 bg-white/80 backdrop-blur"
    style="box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1)"
  >
    <ul class="flex items-center gap-6">
      <li class="logo font-inknut">
        <NuxtLink to="/">Manyumba</NuxtLink>
      </li>
      <li class="font-mulish">Payments</li>
    </ul>
    <ul class="flex gap-6 justify-between items-center">
      <li>
        <NuxtLink class="border border-black rounded px-3 py-1" to="/listings/new">List Property</NuxtLink>
      </li>
      <li class="font-semibold"><span>Log In</span> | <span>Sig Up</span></li>
    </ul>
  </div>
</template>
<style>
.logo {
  font-weight: bold;
  font-size: 20px;
}
</style>
