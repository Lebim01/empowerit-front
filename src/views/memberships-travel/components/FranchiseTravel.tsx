import { MembershipsTravelProps } from '../data/MembershipsProductsData'
import { useState } from 'react'
import { useAppSelector } from '@/store'
import ShowQR from '@/views/memberships/components/ShowQR'
import {
  Coins,
  createPaymentLink,
  Memberships,
  Method,
} from '@/views/memberships/methods'

export default function FranchiseTravel({
  image,
  name,
  binary_points,
  range_points,
}: MembershipsTravelProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [method, setMethod] = useState<Method>('fiat')
  const _createPaymentLink = async (
    type: Memberships,
    currency: Coins,
    method: Method
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
      await createPaymentLink(
        user.uid!,
        type,
        currency,
        method,
        user.email as string
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col rounded-md w-full space-y-4 transition-all duration-75 ring-gray-200 border">
      <div className="flex justify-center">
        <img src={image} alt={image} className="w-full" />
      </div>
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 p-4">
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
  )
}
