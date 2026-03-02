'use client'

import { AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react'

import { TiltCard } from '@/shared/components/tilt-card'

type DashboardStatsCardsProps = {
  activePrescriptions: number
  totalPatients: number
  adherenceRate: number
  pendingAlerts: number
  isLoading?: boolean
}

export function DashboardStatsCards({
  activePrescriptions,
  totalPatients,
  adherenceRate,
  pendingAlerts,
  isLoading,
}: DashboardStatsCardsProps) {
  const display = (value: number | string) => (isLoading ? '-' : value)

  return (
    <section className="stats-grid">
      <TiltCard>
        <div className="stat-card-inner">
          <div>
            <p className="stat-label">Tratamentos ativos</p>
            <div className="stat-value">{display(activePrescriptions)}</div>
            <span className="stat-change neutral">
              prescrições em andamento
            </span>
          </div>
          <div className="stat-icon icon-primary">
            <CheckCircle className="h-[26px] w-[26px]" />
          </div>
        </div>
      </TiltCard>

      <TiltCard>
        <div className="stat-card-inner">
          <div>
            <p className="stat-label">Total de pacientes</p>
            <div className="stat-value">{display(totalPatients)}</div>
            <span className="stat-change neutral">cadastrados</span>
          </div>
          <div className="stat-icon icon-gold">
            <Users className="h-[26px] w-[26px]" />
          </div>
        </div>
      </TiltCard>

      <TiltCard>
        <div className="stat-card-inner">
          <div>
            <p className="stat-label">Adesão média</p>
            <div className="stat-value">{display(`${adherenceRate}%`)}</div>
            <span className="stat-change neutral">aderência às medicações</span>
          </div>
          <div className="stat-icon icon-primary">
            <TrendingUp className="h-[26px] w-[26px]" />
          </div>
        </div>
      </TiltCard>

      <TiltCard>
        <div className="stat-card-inner">
          <div>
            <p className="stat-label">Alertas pendentes</p>
            <div className="stat-value">{display(pendingAlerts)}</div>
            <span className="stat-change neutral">requerem atenção</span>
          </div>
          <div className="stat-icon icon-danger">
            <AlertTriangle className="h-[26px] w-[26px]" />
          </div>
        </div>
      </TiltCard>
    </section>
  )
}
