"use client"

import { KPICards } from "@/components/dashboard/KPICards"
import { SpendChart } from "@/components/dashboard/SpendChart"
import { CampaignTable } from "@/components/dashboard/CampaignTable"
import { AlertsFeed } from "@/components/dashboard/AlertsFeed"
import { AccountSummaryBar } from "@/components/dashboard/AccountSummaryBar"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { SmartInsights } from "@/components/dashboard/SmartInsights"
import { useKPIInsights, useDailyInsights, useAccountSummary } from "@/hooks/use-insights"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useAlerts } from "@/hooks/use-alerts"
import { useMetaAccounts } from "@/hooks/use-meta-accounts"

export default function DashboardPage() {
  useMetaAccounts()

  const kpiQuery = useKPIInsights()
  const dailyQuery = useDailyInsights()
  const summaryQuery = useAccountSummary()
  const campaignsQuery = useCampaigns()
  const alertsQuery = useAlerts()

  return (
    <div className="relative">
      {/* Atmospheric background orbs */}
      <div className="orb orb-blue" />
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />

      <div className="relative z-10 space-y-6">
        {/* Account Summary Bar */}
        <div className="glass-card rounded-xl px-5 py-3">
          <AccountSummaryBar
            data={summaryQuery.data}
            loading={summaryQuery.isLoading}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* KPI Cards */}
        <KPICards
          data={kpiQuery.data?.slice(0, 4) || []}
          loading={kpiQuery.isLoading}
        />

        {/* Chart + Alerts Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SpendChart
              data={dailyQuery.data || []}
              loading={dailyQuery.isLoading}
            />
          </div>
          <div className="xl:col-span-1">
            <AlertsFeed
              alerts={alertsQuery.data?.data || []}
              loading={alertsQuery.isLoading}
            />
          </div>
        </div>

        {/* Smart Insights */}
        <SmartInsights />

        {/* Campaign Table */}
        <CampaignTable
          data={campaignsQuery.data || []}
          loading={campaignsQuery.isLoading}
        />
      </div>
    </div>
  )
}
