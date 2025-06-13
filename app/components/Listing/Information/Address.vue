<script setup lang="ts">
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the schema for address information
const addressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type AddressData = z.infer<typeof addressSchema>;

const addressInfo = reactive<AddressData>({
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

const emits = defineEmits<{
  next: [AddressData];
  back: [];
}>();

function next() {
  try {
    const validated = addressSchema.parse(addressInfo);
    emits("next", validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      $alert(error.errors[0].message);
    } else {
      $alert("Please fill all required fields");
    }
  }
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
