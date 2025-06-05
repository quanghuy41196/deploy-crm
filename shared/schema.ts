import {
  text,
  integer,
  sqliteTable,
  real,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("sales"), // admin, sales, support
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Leads table
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  source: text("source").notNull(), // facebook, zalo, google_ads, manual
  region: text("region"), // ha_noi, ho_chi_minh, da_nang, mien_bac, mien_nam
  product: text("product"),
  content: text("content"), // tin nhắn/form content
  status: text("status").notNull().default("new"), // new, contacted, potential, not_interested
  tags: text("tags"),
  assignedTo: text("assigned_to").references(() => users.id),
  stage: text("stage").notNull().default("reception"), // reception, consulting, quoted, negotiating, closed
  value: real("value"), // VND
  notes: text("notes"),
  lastContactedAt: integer("last_contacted_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedLeads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  assignedUser: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
  }),
}));

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  region: string | null;
  product: string | null;
  content: string | null;
  status: string;
  tags: string | null;
  assignedTo: string | null;
  stage: string;
  value: number | null;
  notes: string | null;
  lastContactedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
