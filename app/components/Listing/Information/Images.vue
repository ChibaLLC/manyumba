<script setup lang="ts">
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";

// Define the schema for images
const imagesSchema = z.object({
  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        preview: z.string(),
        isFeatured: z.boolean().default(false),
      }),
    )
    .min(1, "At least one image is required"),
});

export type ImagesData = z.infer<typeof imagesSchema>;

const imagesData = reactive<{
  images: Array<{
    file: File;
    preview: string;
    isFeatured: boolean;
  }>;
}>({
  images: [],
});

const fileInput = ref<HTMLInputElement | null>(null);

const emits = defineEmits<{
  next: [ImagesData];
  back: [];
}>();

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      imagesData.images.push({
        file,
        preview,
        isFeatured: imagesData.images.length === 0, // First image is featured by default
      });
    };
    reader.readAsDataURL(file);
  });

  // Reset input
  if (fileInput.value) fileInput.value.value = "";
}

function removeImage(index: number) {
  const wasFeature = imagesData.images[index].isFeatured;
  imagesData.images.splice(index, 1);

  // If we removed the featured image, set the first image as featured
  if (wasFeature && imagesData.images.length > 0) {
    imagesData.images[0].isFeatured = true;
  }
}

function setFeatured(index: number) {
  imagesData.images.forEach((img, i) => {
    img.isFeatured = i === index;
  });
}

function triggerFileInput() {
  fileInput.value?.click();
}

function next() {
  try {
    const validated = imagesSchema.parse(imagesData);
    emits("next", validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      $alert(error.errors[0].message);
    } else {
      $alert("Please upload at least one image");
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
      <h1 class="dm-serif-text text-4xl">Property Images</h1>
      <p class="mulish">Upload high-quality images of your property. The first image will be the featured image.</p>
    </div>

    <div class="mt-6">
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" />

      <div
        @click="triggerFileInput"
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-navy transition-colors"
      >
        <Icon name="local:upload" class="w-12 h-12 mx-auto text-gray-400" />
        <p class="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
        <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>

      <div v-if="imagesData.images.length > 0" class="mt-6">
        <h3 class="newton font-semibold text-lg mb-2">Uploaded Images</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in imagesData.images"
            :key="index"
            class="relative group rounded-lg overflow-hidden"
          >
            <img :src="image.preview" :alt="`Property image ${index + 1}`" class="w-full h-32 object-cover" />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <Button variant="destructive" size="icon" class="w-8 h-8 rounded-full" @click.stop="removeImage(index)">
                <Icon name="local:trash" class="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                class="w-8 h-8 rounded-full ml-2"
                :class="image.isFeatured ? 'bg-yellow-500' : 'bg-white text-navy'"
                @click.stop="setFeatured(index)"
              >
                <Icon name="local:star" class="w-4 h-4" />
              </Button>
            </div>
            <div
              v-if="image.isFeatured"
              class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"
            >
              Featured
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" @click="back">Back</Button>
      <Button class="bg-navy text-white" @click="next">Next</Button>
    </div>
  </ListingContainer>
</template>
