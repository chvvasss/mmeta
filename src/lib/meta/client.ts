import bizSdk from "facebook-nodejs-business-sdk"
import { META_API_VERSION } from "../constants"

const { FacebookAdsApi, AdAccount } = bizSdk

let apiInstance: InstanceType<typeof FacebookAdsApi> | null = null

export function getMetaApi(): InstanceType<typeof FacebookAdsApi> {
  if (!apiInstance) {
    const token = process.env.META_ACCESS_TOKEN
    if (!token) throw new Error("META_ACCESS_TOKEN is not configured")

    apiInstance = FacebookAdsApi.init(token)
    apiInstance.setDebug(process.env.NODE_ENV === "development")
  }
  return apiInstance
}

export function getAdAccount(accountId: string) {
  getMetaApi()
  return new AdAccount(accountId)
}

export function getApiVersion(): string {
  return META_API_VERSION
}

export class MetaApiError extends Error {
  code: number
  subcode?: number
  fbTraceId?: string

  constructor(
    message: string,
    code: number,
    subcode?: number,
    fbTraceId?: string
  ) {
    super(message)
    this.name = "MetaApiError"
    this.code = code
    this.subcode = subcode
    this.fbTraceId = fbTraceId
  }

  get isRateLimited(): boolean {
    return this.code === 613 || this.code === 80004
  }

  get isTokenExpired(): boolean {
    return this.code === 190
  }

  get isPermissionError(): boolean {
    return this.code === 10 || this.code === 200
  }
}

export function handleMetaError(error: unknown): never {
  if (error && typeof error === "object" && "response" in error) {
    const resp = (error as Record<string, Record<string, unknown>>).response
    const errData = resp?.error as Record<string, unknown> | undefined

    throw new MetaApiError(
      (errData?.message as string) || "Unknown Meta API error",
      (errData?.code as number) || 0,
      errData?.error_subcode as number | undefined,
      errData?.fbtrace_id as string | undefined
    )
  }
  throw error
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof MetaApiError && error.isRateLimited && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error("Max retries exceeded")
}
