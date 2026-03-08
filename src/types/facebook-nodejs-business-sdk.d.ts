declare module "facebook-nodejs-business-sdk" {
  class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi
    setDebug(debug: boolean): void
  }

  class AdAccount {
    constructor(id: string)
    getCampaigns(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getAdSets(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getAds(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getInsights(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getCustomAudiences(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    createCampaign(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    createAdSet(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    createAd(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    createCustomAudience(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
  }

  class Campaign {
    constructor(id: string)
    get(fields: string[]): Promise<Record<string, unknown>>
    update(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    delete(): Promise<void>
    getInsights(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getAdSets(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
  }

  class AdSet {
    constructor(id: string)
    get(fields: string[]): Promise<Record<string, unknown>>
    update(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    getInsights(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
    getAds(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
  }

  class Ad {
    constructor(id: string)
    get(fields: string[]): Promise<Record<string, unknown>>
    update(fields: string[], params: Record<string, unknown>): Promise<Record<string, unknown>>
    getInsights(fields: string[], params?: Record<string, unknown>): Promise<Record<string, unknown>[]>
  }

  const _default: {
    FacebookAdsApi: typeof FacebookAdsApi
    AdAccount: typeof AdAccount
    Campaign: typeof Campaign
    AdSet: typeof AdSet
    Ad: typeof Ad
  }

  export default _default
}
