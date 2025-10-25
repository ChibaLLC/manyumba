<script lang="ts">
export const { data: imagesData, validate } = useZodState(ImagesSchema);
</script>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Trash, Star } from "lucide-vue-next";
import { ImagesSchema, pasteKeydownListener, pasteEventListener, dropItemListener, blobToFile } from "utils";
import type { ImagesData } from "types";
import { onKeyDown } from "@vueuse/core";

const fileInput = useTemplateRef("fileInput");

const emits = defineEmits<{
  next: [ImagesData];
  back: [];
}>();

function handleFiles(files: IterableKind<File> | FileList) {
  for (const file of files) {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (!imagesData.images) {
        imagesData.images = [];
      }

      imagesData.images.push({
        file,
        preview,
        isFeatured: imagesData.images.length === 0,
      });
    };
    reader.readAsDataURL(file);
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  handleFiles(target.files)

  // Reset input
  if (fileInput.value) fileInput.value.value = "";
}

function removeImage(index: number) {
  if (!imagesData.images?.length) {
    $alert.warning("No image to remove");
    return;
  }

  const wasFeature = imagesData.images[index]?.isFeatured;
  imagesData.images.splice(index, 1);

  // If we removed the featured image, set the first image as featured
  if (wasFeature && imagesData.images.length > 0) {
    imagesData.images[0]!.isFeatured = true;
  }
}

function setFeatured(index: number) {
  if (!imagesData.images?.length) {
    $alert.warning("No images in set");
    return;
  }

  imagesData.images.forEach((img, i) => {
    img.isFeatured = i === index;
  });
}

function triggerFileInput() {
  fileInput.value?.click();
}

function next() {
  const { error, data } = validate({
    prettifyError: true,
  });

  if (error) {
    $alert.error(String(error));
    return;
  }

  emits("next", data);
}

function back() {
  emits("back");
}

function handleBlob(blobs: Blob[] | File[]) {
  handleFiles(blobs.map(blobToFile))
}

onKeyDown(["Control", "Meta", "V", "v"], (e) => {
  if (!e.ctrlKey || !e.metaKey) {
    return;
  }

  if (e.ctrlKey && e.metaKey) {
    return;
  }

  pasteKeydownListener(e, handleBlob);
});

const onPaste = (e: ClipboardEvent) => pasteEventListener(e, handleBlob);

onMounted(() => {
  window.addEventListener("paste", onPaste);
});
onUnmounted(() => {
  window.removeEventListener("paste", onPaste);
});
</script>

<template>
  <ListingContainer @dragover.prevent @drop.prevent="(e: DragEvent) => dropItemListener(e, handleBlob)">
    <div>
      <h1 class="font-dm-serif text-4xl">Property Images</h1>
      <p class="font-mulish">
        Upload high-quality images of your property. The first image will be the featured image.
      </p>
    </div>

    <div class="mt-6">
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" />

      <div
        @click="triggerFileInput"
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pofont-inter hover:border-navy transition-colors"
      >
        <Icon name="mdi:upload" class="w-12 h-12 mx-auto text-gray-400" />
        <p class="mt-2 text-sm text-gray-500">Click, paste, drag or drop to add images</p>
        <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>

      <div v-if="imagesData.images && imagesData.images.length > 0" class="mt-6">
        <h3 class="font-newton font-semibold text-lg mb-2">Uploaded Images</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in imagesData.images"
            :key="index"
            class="relative group rounded-lg overflow-hidden"
          >
            <img :src="image.preview" :alt="`Property image ${index + 1}`" class="w-full h-32 object-cover" />
            <div
              class="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-xs"
            >
              <Button
                variant="destructive"
                size="icon"
                class="w-8 h-8 rounded-full text-white hover:text-red-500"
                @click.stop="removeImage(index)"
              >
                <Trash class="w-4 h-4" />
              </Button>
              <Button variant="default" size="icon" class="w-8 h-8 rounded-full ml-2" @click.stop="setFeatured(index)">
                <Star
                  class="w-4 h-4 text-white"
                  :class="{
                    'text-yellow-500 fill-yellow-500': image.isFeatured,
                  }"
                />
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
