import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	users,
	sessions,
	properties,
	propertyImages,
	appointments,
	favorites,
	reviews,
	messages,
	notifications,
	propertyTypeEnum,
	listingTypeEnum,
	appointmentStatusEnum,
	userRoleEnum,
} from "../schema";

// Enum Types
export type PropertyType = (typeof propertyTypeEnum.enumValues)[number];
export type ListingType = (typeof listingTypeEnum.enumValues)[number];
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];
export type PaymentStatus = (typeof appointmentStatusEnum.enumValues)[number];
export type UserRole = (typeof userRoleEnum.enumValues)[number];

// Table Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Property = InferSelectModel<typeof properties> & {
	features: PropertyFeature[]; // TypeScript will see this as the parsed JSON
};
export type NewProperty = InferInsertModel<typeof properties>;

export type PropertyImage = InferSelectModel<typeof propertyImages>;
export type NewPropertyImage = InferInsertModel<typeof propertyImages>;

export type PropertyFeature = {
	id: string; // Unique identifier for the feature
	name: string; // Name of the feature (e.g., "Swimming Pool", "Air Conditioning")
	value?: string; // Optional value for the feature (e.g., "Yes", "No", "2 Car")
	category?: string; // Optional category (e.g., "Outdoor", "Interior", "Security")
	icon?: string; // Optional icon identifier
};

export type Appointment = InferSelectModel<typeof appointments>;
export type NewAppointment = InferInsertModel<typeof appointments>;

export type Favorite = InferSelectModel<typeof favorites>;
export type NewFavorite = InferInsertModel<typeof favorites>;

export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

// Extended Types (with relations)
export type PropertyWithRelations = Property & {
	owner?: User;
	images?: PropertyImage[];
	appointments?: Appointment[];
	reviews?: Review[];
};

export type UserWithRelations = User & {
	properties?: Property[];
	appointments?: Appointment[];
	favorites?: Property[];
	reviews?: Review[];
	receivedMessages?: Message[];
	sentMessages?: Message[];
	notifications?: Notification[];
};

export type AppointmentWithRelations = Appointment & {
	property?: Property;
	client?: User;
	agent?: User | null;
};

export type ReviewWithRelations = Review & {
	property?: Property;
	user?: User;
};

export type MessageWithRelations = Message & {
	sender?: User;
	receiver?: User;
	property?: Property | null;
};

// Search/Filter Types
export type PropertyFilters = {
	propertyType?: PropertyType[];
	listingType?: ListingType;
	minPrice?: number;
	maxPrice?: number;
	city?: string;
	state?: string;
	country?: string;
	minBedrooms?: number;
	minBathrooms?: number;
	minArea?: number;
	maxArea?: number;
	features?: string[]; // Feature names or IDs to filter by
	sortBy?: "price_asc" | "price_desc" | "created_at_desc" | "created_at_asc";
	page?: number;
	limit?: number;
};

export type PaginationResult<T> = {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasMore: boolean;
};
