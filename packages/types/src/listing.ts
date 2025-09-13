import type z from "zod";
import {
  listingType,
  propertyType,
  homeTypes,
  BasicSchema,
  landTypes,
  AddressSchema,
  DetailsSchema,
  FeaturesSchema,
  ImagesSchema,
  ListingSchema,
} from "utils";

export type ListingType = (typeof listingType)[number];
export type PropertyType = (typeof propertyType)[number];
export type AssetType = (typeof homeTypes)[number] | (typeof landTypes)[number];
export type BasicInfoData = z.infer<typeof BasicSchema>;
export type AddressData = z.infer<typeof AddressSchema>;
export type DetailedInfoData = z.infer<typeof DetailsSchema>;
export type FeaturesData = z.infer<typeof FeaturesSchema>;
export type ImagesData = z.infer<typeof ImagesSchema>;
export type ListingData = z.infer<typeof ListingSchema>;
