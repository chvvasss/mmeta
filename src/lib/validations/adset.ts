import { z } from "zod"

export const optimizationGoals = [
  "LINK_CLICKS",
  "LANDING_PAGE_VIEWS",
  "IMPRESSIONS",
  "REACH",
  "OFFSITE_CONVERSIONS",
  "VALUE",
  "LEAD_GENERATION",
  "APP_INSTALLS",
  "VIDEO_VIEWS",
  "THRUPLAY",
  "ENGAGED_USERS",
] as const

export const billingEvents = [
  "IMPRESSIONS",
  "LINK_CLICKS",
  "THRUPLAY",
] as const

export const placements = [
  "facebook_feed",
  "facebook_stories",
  "facebook_reels",
  "facebook_right_column",
  "instagram_feed",
  "instagram_stories",
  "instagram_reels",
  "instagram_explore",
  "audience_network",
  "messenger_inbox",
  "messenger_stories",
] as const

export const targetingSchema = z.object({
  ageMin: z.number().min(13).max(65).default(18),
  ageMax: z.number().min(13).max(65).default(65),
  genders: z.array(z.number().min(0).max(2)).default([0]),
  geoLocations: z.object({
    countries: z.array(z.string()).default(["TR"]),
    regions: z.array(z.object({ key: z.string(), name: z.string() })).default([]),
    cities: z.array(z.object({ key: z.string(), name: z.string(), radius: z.number().optional() })).default([]),
  }).default(() => ({ countries: ["TR"], regions: [], cities: [] })),
  interests: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  behaviors: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  customAudiences: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  excludedCustomAudiences: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  advantageDetailedTargeting: z.boolean().default(true),
})

export const createAdSetSchema = z.object({
  name: z.string().min(3, "Ad Set adı en az 3 karakter olmalı").max(100),
  campaignId: z.string(),
  status: z.enum(["ACTIVE", "PAUSED"]).default("PAUSED"),
  optimizationGoal: z.enum(optimizationGoals),
  billingEvent: z.enum(billingEvents).default("IMPRESSIONS"),
  budgetType: z.enum(["DAILY", "LIFETIME", "CBO"]),
  dailyBudget: z.number().min(1).optional(),
  lifetimeBudget: z.number().min(10).optional(),
  bidAmount: z.number().min(0.01).optional(),
  targeting: targetingSchema,
  placementType: z.enum(["ADVANTAGE_PLUS", "MANUAL"]).default("ADVANTAGE_PLUS"),
  placements: z.array(z.enum(placements)).optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  attributionWindow: z.enum(["1d_click", "7d_click", "1d_view", "7d_click_1d_view"]).default("7d_click_1d_view"),
})

export const updateAdSetSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).optional(),
  dailyBudget: z.number().min(1).optional(),
  lifetimeBudget: z.number().min(10).optional(),
  targeting: targetingSchema.optional(),
})

export type CreateAdSetInput = z.infer<typeof createAdSetSchema>
export type UpdateAdSetInput = z.infer<typeof updateAdSetSchema>
export type TargetingInput = z.infer<typeof targetingSchema>
