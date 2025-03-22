import { Memberships, Coins, Method } from '../methods'
import { useAppSelector } from '@/store'
import GenerateQR from './GenerateQR'
import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import FormPayOpenpay from './FormPayOpenpay'

const ShowQR = ({
  type,
  loading,
  createPaymentLink,
  method,
}: {
  type: Memberships
  loading: boolean
  createPaymentLink: (
    type: Memberships,
    coin: Coins,
    method: Method,
    buyer_email: string
  ) => void
  method: Method
}) => {
  // Se obtiene el usuario
  const user = useAppSelector((state) => state.auth.user)
  const [linkType, setLinkType] = useState<null | 'openpay' | 'coinpayments'>(
    null
  )
  const [qr, setQR] = useState<any>(null)

  const removeQR = async () => {
    await updateDoc(doc(db, `users/${user?.uid}`), {
      openpay_link: null,
    })
  }

  const getOpenpayQR = async () => {
    const transaction = await getDoc(doc(db, `openpay/${user?.openpay_link}`))
    if (transaction.exists()) {
      const isexpired = null
      if (transaction.get('status') == 'pending') {
        setQR(transaction.data())
        setLinkType('openpay')
      } else {
        await removeQR()
        setQR(null)
      }
    } else {
      await removeQR()
      setQR(null)
    }
  }

  useEffect(() => {
    if (user.openpay_link) getOpenpayQR()
    else setQR(null)
  }, [user.openpay_link])

  if (user.openpay_link && !qr) {
    return null
  }

  if (qr && qr.type != 'membership') return null

  if (qr && qr.membership_type != type) return null

  if (qr && linkType == 'openpay') {
    return <FormPayOpenpay qr={qr} />
  }

  return (
    <>
      <GenerateQR
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    </>
  )
}

export default ShowQR
