import { and, desc, eq, ilike, count, asc } from "drizzle-orm";
import db from "../index";
import { users, sessions, notifications, appointments, reviews } from "../schema";
import type { 
  User, 
  UserWithRelations, 
  Session, 
  Notification,
  PaginationResult 
} from "../types";
import { ulid } from "ulid";
import bcrypt from "bcrypt";

// Get user by ID
export async function getUserById(userUlid: string): Promise<UserWithRelations | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(and(
      eq(users.ulid, userUlid),
      eq(users.isDeleted, false)
    ))
    .limit(1);

  if (!user) return null;

  // Get user statistics
  const [userStats] = await db
    .select({
      appointmentCount: count(appointments.ulid),
      reviewCount: count(reviews.ulid),
    })
    .from(users)
    .leftJoin(appointments, eq(users.ulid, appointments.clientUlid))
    .leftJoin(reviews, eq(users.ulid, reviews.userUlid))
    .where(eq(users.ulid, userUlid))
    .groupBy(users.ulid);

  return {
    ...user,
    appointmentCount: userStats?.appointmentCount || 0,
    reviewCount: userStats?.reviewCount || 0,
  };
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(and(
      eq(users.email, email),
      eq(users.isDeleted, false)
    ))
    .limit(1);

  return user || null;
}

// Create user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "admin" | "agent" | "client";
}): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  const [user] = await db
    .insert(users)
    .values({
      ulid: ulid(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role || "client",
      isVerified: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return user;
}

// Update user
export async function updateUser(userUlid: string, data: Partial<Omit<User, 'ulid' | 'createdAt'>>): Promise<User | null> {
  const updateData: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Hash password if provided
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const [user] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.ulid, userUlid))
    .returning();

  return user || null;
}

// Delete user (soft delete)
export async function deleteUser(userUlid: string): Promise<boolean> {
  const [result] = await db
    .update(users)
    .set({ 
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.ulid, userUlid))
    .returning();

  return !!result;
}

// Verify password
export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  // Update last login
  await db
    .update(users)
    .set({ 
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.ulid, user.ulid));

  return user;
}

// Create session
export async function createSession(userUlid: string, expiresInDays = 30): Promise<Session> {
  const token = ulid();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const [session] = await db
    .insert(sessions)
    .values({
      ulid: ulid(),
      userUlid,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    })
    .returning();

  return session;
}

// Get session by token
export async function getSessionByToken(token: string): Promise<(Session & { user: User }) | null> {
  const [result] = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userUlid, users.ulid))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!result) return null;

  // Check if session is expired
  if (new Date(result.session.expiresAt) < new Date()) {
    await deleteSession(token);
    return null;
  }

  return {
    ...result.session,
    user: result.user,
  };
}

// Delete session
export async function deleteSession(token: string): Promise<boolean> {
  const [result] = await db
    .delete(sessions)
    .where(eq(sessions.token, token))
    .returning();

  return !!result;
}

// Get all users (admin only)
export async function getAllUsers(filters: {
  role?: "admin" | "agent" | "client";
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginationResult<UserWithRelations>> {
  const {
    role,
    search,
    page = 1,
    limit = 20
  } = filters;

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [eq(users.isDeleted, false)];

  if (role) {
    conditions.push(eq(users.role, role));
  }

  if (search) {
    conditions.push(
      ilike(users.name, `%${search}%`) ||
      ilike(users.email, `%${search}%`)
    );
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(users)
    .where(and(...conditions));

  const total = totalResult.count;

  // Get users
  const result = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    data: result,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total
  };
}

// Get user notifications
export async function getUserNotifications(
  userUlid: string, 
  unreadOnly = false
): Promise<Notification[]> {
  const conditions = [eq(notifications.userUlid, userUlid)];
  
  if (unreadOnly) {
    conditions.push(eq(notifications.isRead, false));
  }

  return db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt));
}

// Create notification
export async function createNotification(data: {
  userUlid: string;
  title: string;
  message: string;
  link?: string;
}): Promise<Notification> {
  const [notification] = await db
    .insert(notifications)
    .values({
      ulid: ulid(),
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return notification;
}

// Mark notification as read
export async function markNotificationAsRead(notificationUlid: string): Promise<boolean> {
  const [result] = await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.ulid, notificationUlid))
    .returning();

  return !!result;
}

// Mark all notifications as read for user
export async function markAllNotificationsAsRead(userUlid: string): Promise<number> {
  const result = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(
      eq(notifications.userUlid, userUlid),
      eq(notifications.isRead, false)
    ))
    .returning();

  return result.length;
}
