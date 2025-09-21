import { z } from "zod/v4-mini";
import { homeTypes, landTypes, listingType, propertyType } from "../constants";

export const AddressSchema = z.object({
  address: z.string().check(z.minLength(5, "Address must be at least 5 characters")),
  city: z.string().check(z.minLength(2, "City must be at least 2 characters")),
  state: z.string().check(z.minLength(2, "State must be at least 2 characters")),
  zipCode: z.string().check(z.minLength(3, "Zip code must be at least 3 characters")),
  country: z.string().check(z.minLength(2, "Country must be at least 2 characters")),
});

export const BasicSchema = z.object({
  assetType: z.union([z.enum(homeTypes), z.enum(landTypes)]),
  listingType: z.enum(listingType),
  propertyType: z.enum(propertyType),
});

export const DetailsSchema = z.object({
  title: z.string().check(z.minLength(5, "Title must be at least 5 characters")),
  description: z.string().check(z.minLength(20, "Description must be at least 20 characters")),
  price: z.optional(z.number().check(z.positive("Price must be positive"))),
  bedrooms: z.optional(z.number().check(z.int())),
  bathrooms: z.optional(z.number().check(z.int())),
  area: z.optional(z.number().check(z.positive("Area must be positive"))),
  yearBuilt: z.optional(z.number().check(z.int())),
});

export const FeaturesSchema = z.object({
  features: z.record(z.string(), z.boolean()),
  customFeatures: z.optional(z.array(z.string())),
});

export const ImagesSchema = z.object({
  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        preview: z.string(),
        isFeatured: z.optional(z.boolean()),
      }),
    )
    .check(z.minLength(1)),
});

const CoordSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const ImageSchema = z.object({
  file: z.instanceof(File),
  preview: z.string(),
  isFeatured: z.boolean(),
});

export const ListingSchema = z.object({
  location: CoordSchema,
  meta: z.object({
    basic: BasicSchema,
    detail: DetailsSchema,
  }),
  address: AddressSchema,
  images: z.array(ImageSchema),
  features: FeaturesSchema,
});
