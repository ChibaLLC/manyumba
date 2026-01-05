export async function pasteKeydownListener<T>(event: Event, callback: (blobs: Blob[]) => T) {
  event.preventDefault();
  event.stopPropagation();

  if (!navigator?.clipboard?.read) {
    console.info("Clipboard read is not supported.");
    return;
  }

  const clipboardItems = await navigator.clipboard.read();

  if (!clipboardItems) {
    console.info("There is no clipboard data");
    return;
  }

  const blobs = await parseClipboardItems(clipboardItems);
  return callback?.(blobs);
}

export function dropItemListener<T>(e: DragEvent, callback: (blobs: Blob[]) => T) {
  e.preventDefault();
  e.stopPropagation();
  if (!e.dataTransfer) {
    return callback([]);
  }

  const arr = parseDataTransferItemList(e.dataTransfer.items);
  return callback(arr);
}

async function parseClipboardItems(clipboardItems: ClipboardItem[]) {
  const arr = [];
  for (const clipboardItem of clipboardItems) {
    for (const itemType of clipboardItem.types) {
      let parsedItem: Blob;

      const itemGenericType = itemType.split("/")[0];

      switch (itemGenericType) {
        case "image":
          parsedItem = await clipboardItem.getType(itemType);
          break;

        default:
          console.warn("Unknown clipboard item type: ", itemType);
          continue;
      }

      arr.push(parsedItem);
    }
  }

  return arr;
}

export function pasteEventListener<T>(event: ClipboardEvent, callback: (blobs: File[]) => T) {
  event.preventDefault();
  event.stopPropagation();

  const clipboardData = event.clipboardData;

  if (!clipboardData) {
    console.info("There is no clipboard data");
    return;
  }

  const clipboardItems = clipboardData.items;

  const files = parseDataTransferItemList(clipboardItems);
  return callback?.(files);
}

function parseDataTransferItemList(items: DataTransferItemList) {
  const arr = [];
  for (const item of items) {
    let parsedItem: File | null = null;

    const itemGenericType = item.type.split("/")[0];

    switch (itemGenericType) {
      case "image":
        parsedItem = item.getAsFile();
        break;

      default:
        console.warn("Unknown clipboard item type: ", item.type);
        continue;
    }

    if (!parsedItem) {
      console.warn("empty item???");
      continue;
    }

    arr.push(parsedItem);
  }

  return arr;
}

export function blobToFile(blob: Blob, fileName?: string | number): File {
  const b: any = blob;
  if (!b.lastModifiedDate) {
    b.lastModifiedDate = new Date();
  }

  if (!b.name) {
    b.name = String(fileName || "unknown_file");
  }

  return blob as File;
}
