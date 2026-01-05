<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useZodState from "~/composables/useZodState";
import { AddressSchema } from "utils";
import type { AddressData } from "types";

// Define the schema for address information
const addressData = useZodState(AddressSchema);

const emits = defineEmits<{
  next: [AddressData];
  back: [];
}>();
function next() {
  const { error, data } = addressData.validate({
    prettifyError: true,
    breaks: true,
  });

  if (error) {
    console.log(error);
    $alert.error(String(error));
    return;
  }

  emits("next", data);
}

function back() {
  emits("back");
}
</script>

<template>
  <ListingContainer>
    <div>
      <h1 class="font-dm-serif text-4xl">Address Information</h1>
      <p class="font-mulish">Enter the complete address of your property.</p>
    </div>

    <div class="mt-6 space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Street Address</label>
        <Input v-model="addressData.data.address" placeholder="123 Main St" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">City</label>
          <Input v-model="addressData.data.city" placeholder="New York" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">State/Province</label>
          <Input v-model="addressData.data.state" placeholder="NY" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Zip/Postal Code</label>
          <Input v-model="addressData.data.zipCode" placeholder="10001" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Country</label>
          <Input v-model="addressData.data.country" placeholder="United States" class="w-full" />
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
