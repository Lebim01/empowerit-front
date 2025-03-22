import { useState } from 'react'
import {
  AutomaticFranchises,
  Coins,
  createPaymentLink,
  Method,
  Memberships,
} from '../memberships/methods'
import { useAppSelector } from '@/store'
import ShowQR from '../memberships/components/ShowQR'

export type FranchiseAutomaticProps = {
  name: AutomaticFranchises
  binary_points: number
  range_points: number
  image: string
}

export default function FranchiseAutomatic({
  name,
  binary_points,
  range_points,
  image,
}: FranchiseAutomaticProps) {
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
    <div className="flex flex-col rounded-md w-full p-4 space-y-4 transition-all duration-75 ring-gray-200 border">
      <div className="flex justify-center">
        <img src={image} alt={name} className="max-h-[250px] max-w-[300px]" />
      </div>
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 ">
        {/* Nombre de la franquicia automatica */}
        <span className="text-left">Franquicia: </span>
        <span className="font-bold">{name}</span>
        {/* Puntos de binario */}
        <span className="text-left truncate">Puntos de Binario: </span>
        <span className="font-bold">{binary_points} puntos</span>
        {/* Puntos de rango */}
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
