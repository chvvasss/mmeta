import type { DatePreset } from "@/lib/constants"

export interface KPIData {
  label: string
  value: number
  previousValue: number
  format: "currency" | "number" | "percent"
  changePercent: number
  trend: "up" | "down" | "flat"
}

export interface DateRange {
  from: Date
  to: Date
  preset?: DatePreset
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface SpendChartData {
  date: string
  spend: number
  impressions: number
  clicks: number
  cpc: number
  ctr: number
  conversions?: number
  revenue?: number
}

export interface CampaignTableRow {
  id: string
  name: string
  status: string
  effectiveStatus: string
  objective: string
  dailyBudget: number | null
  lifetimeBudget: number | null
  spend: number
  impressions: number
  clicks: number
  cpc: number
  ctr: number
  conversions: number
  roas: number
  learningPhase: string | null
  opportunityScore: number | null
}

export interface AlertItem {
  id: string
  type: string
  severity: "info" | "warning" | "critical"
  title: string
  message: string
  entityType?: string
  entityId?: string
  isRead: boolean
  createdAt: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  error?: string
  pagination?: PaginationParams
}

export interface SelectOption {
  value: string
  label: string
}
