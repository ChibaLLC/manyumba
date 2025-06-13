import { z } from "zod/v4";

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
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: propertyTypeEnum,
  listingType: listingTypeEnum,
  price: z.number().positive("Price must be positive"),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  area: z.number().positive("Area must be positive").optional(),
  yearBuilt: z.number().int().optional(),
});

// Address schema
export const addressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

// Images schema
export const imagesSchema = z.object({
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
