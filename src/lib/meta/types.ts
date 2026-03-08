export interface MetaAdAccount {
  id: string
  name: string
  currency: string
  timezone_name: string
  account_status: number
  amount_spent: string
  balance: string
  business_name?: string
}

export interface MetaCampaign {
  id: string
  name: string
  status: string
  effective_status: string
  objective: string
  buying_type?: string
  daily_budget?: string
  lifetime_budget?: string
  bid_strategy?: string
  special_ad_categories?: string[]
  start_time?: string
  stop_time?: string
  created_time?: string
  updated_time?: string
  budget_remaining?: string
}

export interface MetaAdSet {
  id: string
  campaign_id: string
  name: string
  status: string
  effective_status: string
  optimization_goal?: string
  billing_event?: string
  daily_budget?: string
  lifetime_budget?: string
  bid_amount?: string
  targeting?: MetaTargeting
  promoted_object?: Record<string, string>
  start_time?: string
  stop_time?: string
  learning_phase_info?: string
}

export interface MetaAd {
  id: string
  adset_id: string
  name: string
  status: string
  effective_status: string
  creative?: { id: string }
  preview_shareable_link?: string
  tracking_specs?: Record<string, unknown>[]
}

export interface MetaTargeting {
  age_min?: number
  age_max?: number
  genders?: number[]
  geo_locations?: {
    countries?: string[]
    regions?: { key: string; name: string }[]
    cities?: { key: string; name: string; radius?: number }[]
  }
  flexible_spec?: Array<{
    interests?: { id: string; name: string }[]
    behaviors?: { id: string; name: string }[]
    demographics?: { id: string; name: string }[]
  }>
  exclusions?: MetaTargeting["flexible_spec"]
  custom_audiences?: { id: string; name: string }[]
  excluded_custom_audiences?: { id: string; name: string }[]
  publisher_platforms?: string[]
  facebook_positions?: string[]
  instagram_positions?: string[]
}

export interface MetaInsight {
  date_start: string
  date_stop: string
  spend: string
  impressions: string
  reach: string
  clicks: string
  unique_clicks?: string
  cpc: string
  cpm: string
  ctr: string
  frequency: string
  actions?: MetaAction[]
  action_values?: MetaAction[]
  cost_per_action_type?: MetaAction[]
  quality_ranking?: string
  engagement_rate_ranking?: string
  conversion_rate_ranking?: string
  video_avg_time_watched_actions?: MetaAction[]
  video_p25_watched_actions?: MetaAction[]
  video_p50_watched_actions?: MetaAction[]
  video_p75_watched_actions?: MetaAction[]
  video_p100_watched_actions?: MetaAction[]
  outbound_clicks?: MetaAction[]
  inline_link_clicks?: string
  inline_link_click_ctr?: string
}

export interface MetaAction {
  action_type: string
  value: string
}

export interface MetaCustomAudience {
  id: string
  name: string
  subtype: string
  approximate_count?: number
  delivery_status?: { status: string }
  operation_status?: { status: number; description: string }
  retention_days?: number
  lookalike_spec?: {
    origin: { id: string; name: string }[]
    ratio: number
    country: string
  }
  rule?: string
  time_created?: string
}

export interface MetaAdLibraryResult {
  id: string
  ad_creation_time: string
  ad_creative_bodies?: string[]
  ad_creative_link_captions?: string[]
  ad_creative_link_titles?: string[]
  ad_snapshot_url: string
  page_id: string
  page_name: string
  publisher_platforms?: string[]
}

export interface MetaPixelStats {
  event_name: string
  count: number
  event_source?: string
}

export const CAMPAIGN_FIELDS = [
  "id",
  "name",
  "status",
  "effective_status",
  "objective",
  "buying_type",
  "daily_budget",
  "lifetime_budget",
  "bid_strategy",
  "special_ad_categories",
  "start_time",
  "stop_time",
  "created_time",
  "updated_time",
  "budget_remaining",
].join(",")

export const INSIGHT_FIELDS = [
  "spend",
  "impressions",
  "reach",
  "frequency",
  "clicks",
  "unique_clicks",
  "cpc",
  "cpm",
  "ctr",
  "actions",
  "action_values",
  "cost_per_action_type",
  "quality_ranking",
  "engagement_rate_ranking",
  "conversion_rate_ranking",
  "inline_link_clicks",
  "inline_link_click_ctr",
  "outbound_clicks",
].join(",")
