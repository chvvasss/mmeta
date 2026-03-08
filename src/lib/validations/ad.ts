import { z } from "zod"

export const ctaTypes = [
  "LEARN_MORE",
  "SHOP_NOW",
  "SIGN_UP",
  "CONTACT_US",
  "BOOK_TRAVEL",
  "DOWNLOAD",
  "GET_OFFER",
  "GET_QUOTE",
  "SUBSCRIBE",
  "WATCH_MORE",
  "APPLY_NOW",
  "ORDER_NOW",
] as const

export const creativeFormats = [
  "SINGLE_IMAGE",
  "SINGLE_VIDEO",
  "CAROUSEL",
] as const

export const createAdSchema = z.object({
  name: z.string().min(3, "Reklam adı en az 3 karakter olmalı").max(100),
  adSetId: z.string(),
  status: z.enum(["ACTIVE", "PAUSED"]).default("PAUSED"),
  creativeFormat: z.enum(creativeFormats),
  primaryText: z.string().min(1, "Ana metin gerekli").max(2200),
  headline: z.string().max(255).optional(),
  description: z.string().max(255).optional(),
  ctaType: z.enum(ctaTypes).default("LEARN_MORE"),
  websiteUrl: z.string().url("Geçerli bir URL girin"),
  displayUrl: z.string().optional(),
  utmSource: z.string().default("facebook"),
  utmMedium: z.string().default("paid"),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  dynamicCreative: z.boolean().default(false),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  carouselCards: z.array(z.object({
    imageUrl: z.string(),
    headline: z.string().max(255),
    description: z.string().max(255).optional(),
    websiteUrl: z.string().url(),
  })).max(10).optional(),
})

export const updateAdSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).optional(),
  primaryText: z.string().max(2200).optional(),
  headline: z.string().max(255).optional(),
  ctaType: z.enum(ctaTypes).optional(),
})

export type CreateAdInput = z.infer<typeof createAdSchema>
export type UpdateAdInput = z.infer<typeof updateAdSchema>
