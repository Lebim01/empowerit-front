import { useState } from 'react'
import { useAppSelector } from '@/store'
import ShowQR from '@/views/memberships/components/ShowQR'
import {
  Coins,
  createPaymentLink,
  Memberships,
  Method,
} from '@/views/memberships/methods'
import { MembershipsBusinessProps } from '../data/MembershipsDigitalData'

export default function FranchiseDigital({
  image,
  name,
  binary_points,
  range_points,
}: MembershipsBusinessProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [method, setMethod] = useState<Method>('fiat')
  const _createPaymentLink = async (
    type: Memberships,
    currency: Coins,
    method: Method,
    buyer_email: string
  ) => {
    try {
      if (loading) return
      setLoading(true)
      setMethod(
        user.payment_link
          ? user.payment_link[type]?.openpay
            ? 'fiat'
            : 'coinpayments'
          : 'coinpayments'
      )
      await createPaymentLink(user.uid!, type, currency, method, buyer_email)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col rounded-md w-full space-y-4 transition-all duration-75 ring-gray-200 border">
      <div className="flex justify-center">
        <img src={image} alt={image} className="w-full object-contain" />
      </div>
      <div className='p-4'>
        <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
          <span className="text-left">Franquicia: </span>
          <span className="font-bold">{name}</span>
          <span className="text-left truncate">Puntos de Binario: </span>
          <span className="font-bold">{binary_points} puntos</span>
          <span className="text-left truncate">Puntos de Rango: </span>
          <span className="font-bold">{range_points} puntos</span>
        </div>
        <ShowQR
          type={name}
          loading={loading}
          createPaymentLink={_createPaymentLink}
          method={method}
        />
      </div>
    </div>
  )
}
