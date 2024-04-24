import { useState } from 'react'
import MarketplaceList from './list'
import MarketplaceForm from './form'
import MarketplaceCheckout from './checkout'

const Marketplace = () => {
  const [stage, setStage] = useState<'cart' | 'form' | 'checkout'>('cart')

  if(stage == 'checkout')
    return <MarketplaceCheckout />

  if (stage == 'form')
    return (
      <MarketplaceForm
        onBack={() => setStage('cart')}
        onComplete={() => setStage('checkout')}
      />
    )

  return <MarketplaceList onComplete={() => setStage('form')} />
}

export default Marketplace
