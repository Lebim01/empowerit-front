import { useState } from 'react'
import MarketplaceDistributorList from './list'
import MarketplaceDistributorForm from './form'

export default function MarketplaceDistributor() {
  const [stage, setStage] = useState<'cart' | 'form'>('cart')
  if (stage === 'form') {
    return <MarketplaceDistributorForm />
  }
  return <MarketplaceDistributorList onComplete={() => setStage('form')} />
}
