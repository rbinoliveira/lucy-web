'use client'

import { AlertNotification } from '@/features/dashboard/components/alert-notification'

type DashboardAlertsCardProps = {
  pendingAlerts: number | undefined
}

export function DashboardAlertsCard({
  pendingAlerts,
}: DashboardAlertsCardProps) {
  return (
    <div className="glass-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Alertas</h2>
          <p className="card-subtitle">Notificações que requerem sua atenção</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {pendingAlerts === 0 ? (
          <p className="text-text-three text-sm">
            Nenhum alerta pendente no momento.
          </p>
        ) : (
          <>
            <AlertNotification
              type="danger"
              title="Maria Silva não confirmou dose há 3 dias"
              description="Amoxicilina 500mg - Última confirmação: 15/01/2024"
              onContact={() => {}}
            />
            <AlertNotification
              type="warning"
              title="João Santos atrasou dose por 2 horas"
              description="Ibuprofeno 600mg - Horário previsto: 14:00"
              onContact={() => {}}
            />
            <AlertNotification
              type="info"
              title="Ana Costa perdeu dose de ontem"
              description="Paracetamol 750mg - Dose não confirmada: 17/01/2024"
              onContact={() => {}}
            />
          </>
        )}
      </div>
    </div>
  )
}
