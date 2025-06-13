<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
</script>
<template>
  <ListingContainer>
    <div>
      <h1 class="dm-serif-text text-4xl">Basic Information</h1>
      <p class="mulish">Put in as much details as needed.</p>
    </div>
    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Lease Type</h2>
      <div class="flex gap-3">
        <Button class="bg-navy text-white">
          <Icon name="local:heart-home" />
          Sale
        </Button>
        <Button class="text-navyhite bg-sky-100 border-sky-200 border">
          <Icon name="local:smile-home" />
          Rent
        </Button>
      </div>
    </div>
    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Property Type</h2>
      <div class="flex gap-3">
        <Button class="bg-navy text-white">
          <Icon name="local:shroom-home" />
          Home
        </Button>
        <Button class="text-navyhite bg-sky-100 border-sky-200 border">
          <Icon name="local:land" />
          Land
        </Button>
      </div>
    </div>
    <div class="mt-6">
      <h2 class="newton font-semibold text-lg mb-2">Home Type</h2>
      <Input class="bg-white rounded-md border-sky-200 border w-56 outline-none focus:ring p-1">
        <Icon name="local:search" />
      </Input>
    </div>
  </ListingContainer>
</template>
