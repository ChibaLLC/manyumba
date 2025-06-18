<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AddressData } from "~~/shared/schemas/listing";

const emits = defineEmits<{
  next: [AddressData];
  back: [];
}>();
const addressInfo = reactive<AddressData>(<AddressData>{});

function next() {
  emits("next", addressInfo);
}

function back() {
  emits("back");
}
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="dm-serif-text text-4xl">Address Information</h1>
      <p class="mulish">Enter the complete address of your property.</p>
    </div>

    <div class="mt-6 space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Street Address</label>
        <Input v-model="addressInfo.address" placeholder="123 Main St" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">City</label>
          <Input v-model="addressInfo.city" placeholder="New York" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">State/Province</label>
          <Input v-model="addressInfo.state" placeholder="NY" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Zip/Postal Code</label>
          <Input v-model="addressInfo.zipCode" placeholder="10001" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Country</label>
          <Input v-model="addressInfo.country" placeholder="United States" class="w-full" />
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
