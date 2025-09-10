<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useZodState from "~/composables/useZodState";
import { z } from "zod/v4-mini";

// Define the schema for address information
const addressData = useZodState({
  address: z.string().check(z.minLength(5, "Address must be at least 5 characters")),
  city: z.string().check(z.minLength(2, "City must be at least 2 characters")),
  state: z.string().check(z.minLength(2, "State must be at least 2 characters")),
  zipCode: z.string().check(z.minLength(3, "Zip code must be at least 3 characters")),
  country: z.string().check(z.minLength(2, "Country must be at least 2 characters")),
});

export type AddressData = z.infer<(typeof addressData)["schema"]>;

const emits = defineEmits<{
  next: [AddressData];
  back: [];
}>();
function next() {
  const { error, data } = addressData.validate({
    prettifyError: true,
    breaks: true
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
