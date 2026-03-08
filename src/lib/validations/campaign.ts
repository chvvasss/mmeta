import { z } from "zod"

export const campaignObjectives = [
  "OUTCOME_TRAFFIC",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_LEADS",
  "OUTCOME_SALES",
  "OUTCOME_AWARENESS",
  "OUTCOME_APP_PROMOTION",
] as const

export const bidStrategies = [
  "LOWEST_COST_WITHOUT_CAP",
  "COST_CAP",
  "BID_CAP",
  "MINIMUM_ROAS",
] as const

export const campaignStatuses = [
  "ACTIVE",
  "PAUSED",
] as const

export const specialAdCategories = [
  "NONE",
  "EMPLOYMENT",
  "HOUSING",
  "CREDIT",
  "ISSUES_ELECTIONS_POLITICS",
] as const

export const createCampaignSchema = z.object({
  name: z.string().min(3, "Kampanya adı en az 3 karakter olmalı").max(100, "Kampanya adı en fazla 100 karakter olabilir"),
  objective: z.enum(campaignObjectives, { message: "Geçerli bir hedef seçin" }),
  status: z.enum(campaignStatuses).default("PAUSED"),
  budgetType: z.enum(["DAILY", "LIFETIME"]),
  dailyBudget: z.number().min(1, "Günlük bütçe en az ₺1 olmalı").optional(),
  lifetimeBudget: z.number().min(10, "Toplam bütçe en az ₺10 olmalı").optional(),
  bidStrategy: z.enum(bidStrategies).default("LOWEST_COST_WITHOUT_CAP"),
  bidAmount: z.number().min(0.01).optional(),
  specialAdCategories: z.array(z.enum(specialAdCategories)).default(["NONE"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  advantagePlus: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.budgetType === "DAILY") return data.dailyBudget !== undefined && data.dailyBudget > 0
    if (data.budgetType === "LIFETIME") return data.lifetimeBudget !== undefined && data.lifetimeBudget > 0
    return true
  },
  { message: "Seçilen bütçe türü için miktar belirleyin" }
)

export const updateCampaignSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).optional(),
  dailyBudget: z.number().min(1).optional(),
  lifetimeBudget: z.number().min(10).optional(),
  bidStrategy: z.enum(bidStrategies).optional(),
  bidAmount: z.number().min(0.01).optional(),
  endTime: z.string().optional(),
})

export const inlineEditBudgetSchema = z.object({
  campaignId: z.string(),
  dailyBudget: z.number().min(1, "Bütçe en az ₺1 olmalı"),
})

export const inlineEditStatusSchema = z.object({
  campaignId: z.string(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]),
})

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
