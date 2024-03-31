import LastLives from './Charts/LastLives'
import store from '@/store'
import React from 'react'
import TopGananciasMes from './Charts/TopGananciasMes'
import TopFirmasMes from './Charts/TopFirmasMes'

interface CardProps {
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <div className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2 overflow-hidden h-[450px] min-h-[450px]">
      {children}
    </div>
  )
}

const Charts = () => {
  const user = store.getState().auth.user
  const proSubscription = user?.subscription?.pro
  const hasProMembership = proSubscription && proSubscription.status === 'paid'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">
      {hasProMembership && (
        <Card>
          <LastLives />
        </Card>
      )}
      <Card>
        <TopFirmasMes />
      </Card>
      <Card>
        <TopGananciasMes />
      </Card>
    </div>
  )
}

export default Charts
