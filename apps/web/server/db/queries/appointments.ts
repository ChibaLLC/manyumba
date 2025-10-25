import { and, desc, eq, gte, lte, count, asc } from "drizzle-orm";
import db from "../index";
import { appointments, properties, users, reviews } from "../schema";
import type { 
  Appointment, 
  AppointmentWithRelations,
  Review,
  ReviewWithRelations,
  PaginationResult 
} from "../types";
import { ulid } from "ulid";

// Get appointment by ID
export async function getAppointmentById(appointmentUlid: string): Promise<AppointmentWithRelations | null> {
  const [result] = await db
    .select({
      appointment: appointments,
      property: properties,
      client: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      },
      agent: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      }
    })
    .from(appointments)
    .leftJoin(properties, eq(appointments.propertyUlid, properties.ulid))
    .leftJoin(users, eq(appointments.clientUlid, users.ulid))
    .leftJoin(users, eq(appointments.agentUlid, users.ulid))
    .where(eq(appointments.ulid, appointmentUlid))
    .limit(1);

  if (!result) return null;

  return {
    ...result.appointment,
    property: result.property,
    client: result.client,
    agent: result.agent
  };
}

// Create appointment
export async function createAppointment(data: {
  propertyUlid: string;
  clientUlid: string;
  agentUlid?: string;
  dateTime: string;
  duration?: number;
  notes?: string;
}): Promise<Appointment> {
  const [appointment] = await db
    .insert(appointments)
    .values({
      ulid: ulid(),
      ...data,
      status: "pending",
      duration: data.duration || 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return appointment;
}

// Update appointment
export async function updateAppointment(
  appointmentUlid: string, 
  data: Partial<Omit<Appointment, 'ulid' | 'createdAt'>>
): Promise<Appointment | null> {
  const [appointment] = await db
    .update(appointments)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(appointments.ulid, appointmentUlid))
    .returning();

  return appointment || null;
}

// Delete appointment
export async function deleteAppointment(appointmentUlid: string): Promise<boolean> {
  const [result] = await db
    .delete(appointments)
    .where(eq(appointments.ulid, appointmentUlid))
    .returning();

  return !!result;
}

// Get user appointments
export async function getUserAppointments(
  userUlid: string, 
  role: "client" | "agent" = "client",
  filters: {
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginationResult<AppointmentWithRelations>> {
  const {
    status,
    startDate,
    endDate,
    page = 1,
    limit = 20
  } = filters;

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];
  
  if (role === "client") {
    conditions.push(eq(appointments.clientUlid, userUlid));
  } else {
    conditions.push(eq(appointments.agentUlid, userUlid));
  }

  if (status) {
    conditions.push(eq(appointments.status, status));
  }

  if (startDate) {
    conditions.push(gte(appointments.dateTime, startDate));
  }

  if (endDate) {
    conditions.push(lte(appointments.dateTime, endDate));
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(appointments)
    .where(and(...conditions));

  const total = totalResult.count;

  // Get appointments with relations
  const result = await db
    .select({
      appointment: appointments,
      property: {
        ulid: properties.ulid,
        title: properties.title,
        address: properties.address,
        city: properties.city,
        state: properties.state,
        price: properties.price,
        propertyType: properties.propertyType,
        listingType: properties.listingType,
      },
      client: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      },
      agent: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      }
    })
    .from(appointments)
    .leftJoin(properties, eq(appointments.propertyUlid, properties.ulid))
    .leftJoin(users, eq(appointments.clientUlid, users.ulid))
    .leftJoin(users, eq(appointments.agentUlid, users.ulid))
    .where(and(...conditions))
    .orderBy(desc(appointments.dateTime))
    .limit(limit)
    .offset(offset);

  const data = result.map(row => ({
    ...row.appointment,
    property: row.property,
    client: row.client,
    agent: row.agent
  }));

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total
  };
}

// Get property appointments (for property owners/agents)
export async function getPropertyAppointments(
  propertyUlid: string,
  filters: {
    status?: "pending" | "confirmed" | "cancelled" | "completed";
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<AppointmentWithRelations[]> {
  const {
    status,
    startDate,
    endDate
  } = filters;

  // Build conditions
  const conditions = [eq(appointments.propertyUlid, propertyUlid)];

  if (status) {
    conditions.push(eq(appointments.status, status));
  }

  if (startDate) {
    conditions.push(gte(appointments.dateTime, startDate));
  }

  if (endDate) {
    conditions.push(lte(appointments.dateTime, endDate));
  }

  const result = await db
    .select({
      appointment: appointments,
      property: properties,
      client: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      },
      agent: {
        ulid: users.ulid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        profileImage: users.profileImage,
      }
    })
    .from(appointments)
    .leftJoin(properties, eq(appointments.propertyUlid, properties.ulid))
    .leftJoin(users, eq(appointments.clientUlid, users.ulid))
    .leftJoin(users, eq(appointments.agentUlid, users.ulid))
    .where(and(...conditions))
    .orderBy(asc(appointments.dateTime));

  return result.map(row => ({
    ...row.appointment,
    property: row.property,
    client: row.client,
    agent: row.agent
  }));
}

// REVIEWS

// Get review by ID
export async function getReviewById(reviewUlid: string): Promise<ReviewWithRelations | null> {
  const [result] = await db
    .select({
      review: reviews,
      property: {
        ulid: properties.ulid,
        title: properties.title,
        address: properties.address,
      },
      user: {
        ulid: users.ulid,
        name: users.name,
        profileImage: users.profileImage,
      }
    })
    .from(reviews)
    .leftJoin(properties, eq(reviews.propertyUlid, properties.ulid))
    .leftJoin(users, eq(reviews.userUlid, users.ulid))
    .where(eq(reviews.ulid, reviewUlid))
    .limit(1);

  if (!result) return null;

  return {
    ...result.review,
    property: result.property,
    user: result.user
  };
}

// Create review
export async function createReview(data: {
  propertyUlid: string;
  userUlid: string;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const [review] = await db
    .insert(reviews)
    .values({
      ulid: ulid(),
      ...data,
      isApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return review;
}

// Update review
export async function updateReview(
  reviewUlid: string, 
  data: Partial<Omit<Review, 'ulid' | 'createdAt'>>
): Promise<Review | null> {
  const [review] = await db
    .update(reviews)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(reviews.ulid, reviewUlid))
    .returning();

  return review || null;
}

// Delete review
export async function deleteReview(reviewUlid: string): Promise<boolean> {
  const [result] = await db
    .delete(reviews)
    .where(eq(reviews.ulid, reviewUlid))
    .returning();

  return !!result;
}

// Get property reviews
export async function getPropertyReviews(
  propertyUlid: string,
  approvedOnly = true
): Promise<ReviewWithRelations[]> {
  const conditions = [eq(reviews.propertyUlid, propertyUlid)];
  
  if (approvedOnly) {
    conditions.push(eq(reviews.isApproved, true));
  }

  const result = await db
    .select({
      review: reviews,
      user: {
        ulid: users.ulid,
        name: users.name,
        profileImage: users.profileImage,
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userUlid, users.ulid))
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt));

  return result.map(row => ({
    ...row.review,
    user: row.user
  }));
}

// Get user reviews
export async function getUserReviews(userUlid: string): Promise<ReviewWithRelations[]> {
  const result = await db
    .select({
      review: reviews,
      property: {
        ulid: properties.ulid,
        title: properties.title,
        address: properties.address,
      }
    })
    .from(reviews)
    .leftJoin(properties, eq(reviews.propertyUlid, properties.ulid))
    .where(eq(reviews.userUlid, userUlid))
    .orderBy(desc(reviews.createdAt));

  return result.map(row => ({
    ...row.review,
    property: row.property
  }));
}

// Get pending reviews (admin only)
export async function getPendingReviews(
  page = 1,
  limit = 20
): Promise<PaginationResult<ReviewWithRelations>> {
  const offset = (page - 1) * limit;

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.isApproved, false));

  const total = totalResult.count;

  const result = await db
    .select({
      review: reviews,
      property: {
        ulid: properties.ulid,
        title: properties.title,
        address: properties.address,
      },
      user: {
        ulid: users.ulid,
        name: users.name,
        profileImage: users.profileImage,
      }
    })
    .from(reviews)
    .leftJoin(properties, eq(reviews.propertyUlid, properties.ulid))
    .leftJoin(users, eq(reviews.userUlid, users.ulid))
    .where(eq(reviews.isApproved, false))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

  const data = result.map(row => ({
    ...row.review,
    property: row.property,
    user: row.user
  }));

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total
  };
}
