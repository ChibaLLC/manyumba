// FIXME: Maybe we shouldn't dump everything into one file, opt to co-locate
import { z } from "zod/v4/mini";

// Enums
export const propertyTypeEnum = z.enum(["apartment", "house", "commercial", "plot", "land"]);
export const listingTypeEnum = z.enum(["rent", "sale"]);
export const appointmentStatusEnum = z.enum(["pending", "confirmed", "cancelled", "completed"]);

// Location schema
export const locationSchema = z.object({
  cood: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  isAccurate: z.boolean(),
});
// Basic information schema
export const basicInfoSchema = z.object({
  title: z
    .string()
    .check(z.minLength(5))
    .check(
      // Custom error message is supported via an inline refine, since check() doesn't accept message directly
      z.refine((value) => value.length >= 5, { error: "Title must be at least 5 characters" })
    ),

  description: z
    .string()
    .check(z.minLength(20))
    .check(z.refine((value) => value.length >= 20, { error: "Description must be at least 20 characters" })),

  propertyType: propertyTypeEnum,
  listingType: listingTypeEnum,

  price: z
    .number()
    .check(z.gt(0))
    .check(z.refine((value) => value > 0, { error: "Price must be positive" })),

  bedrooms: z.optional(z.number().check(z.int())),
  bathrooms: z.optional(z.number().check(z.int())),

  area: z.optional(
    z
      .number()
      .check(z.gt(0))
      .check(z.refine((value) => value > 0, { error: "Area must be positive" }))
  ),

  yearBuilt: z.optional(z.number().check(z.int())),
});

// Address schema
export const addressSchema = z.object({
  address: z
    .string()
    .check(z.minLength(5))
    .check(z.refine((value) => value.length >= 5, { error: "Address must be at least 5 characters" })),

  city: z
    .string()
    .check(z.minLength(2))
    .check(z.refine((value) => value.length >= 2, { error: "City must be at least 2 characters" })),

  state: z
    .string()
    .check(z.minLength(2))
    .check(z.refine((value) => value.length >= 2, { error: "State must be at least 2 characters" })),

  zipCode: z
    .string()
    .check(z.minLength(3))
    .check(z.refine((value) => value.length >= 3, { error: "Zip code must be at least 3 characters" })),

  country: z
    .string()
    .check(z.minLength(2))
    .check(z.refine((value) => value.length >= 2, { error: "Country must be at least 2 characters" })),
});

// Images schema
export const imagesSchema = z.object({
  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        preview: z.string(),
        isFeatured: z.optional(z.boolean()),
      })
    )
    .check(z.minLength(1)),
});

// Features schema
export const featuresSchema = z.object({
  features: z.record(z.string(), z.boolean()),
  customFeatures: z.array(z.string()),
});

// Complete listing schema
export const listingSchema = z.object({
  location: locationSchema,
  basicInfo: basicInfoSchema,
  address: addressSchema,
  images: imagesSchema,
  features: featuresSchema,
});

// Types
export type LocationData = z.infer<typeof locationSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type ImagesData = z.infer<typeof imagesSchema>;
export type FeaturesData = z.infer<typeof featuresSchema>;
export type ListingData = z.infer<typeof listingSchema>;

// Property database schema type
export type PropertyData = {
  ulid: string;
  ownerUlid: string;
  title: string;
  description: string;
  propertyType: z.infer<typeof propertyTypeEnum>;
  listingType: z.infer<typeof listingTypeEnum>;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  yearBuilt: number | null;
  features: Record<string, any>;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

// Property image database schema type
export type PropertyImageData = {
  ulid: string;
  propertyUlid: string;
  imageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
