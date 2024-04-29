import { useEffect, useState } from 'react'
import MarketplaceList from './list'
import MarketplaceForm from './form'
import MarketplaceCheckout from './checkout'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'

const Marketplace = () => {
  const [stage, setStage] = useState<'cart' | 'form' | 'checkout'>('cart')
  const user = useAppSelector((state) => state.auth.user)
  const [cartPaymentStatus, setPaymentStatus] = useState<string>('')

  useEffect(() => {
    getCart()  
  }, [])

  const getCart = async () => {
    const res = await getDoc(doc(db, `users/${user.uid}/cart/1`))
    if(res.exists()){
      try {
        setPaymentStatus(res.get('payment_link.status'))
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    if(cartPaymentStatus == "confirming") {
      setStage('checkout')
    }
  }, [cartPaymentStatus])

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
