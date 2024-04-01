import dayjs from 'dayjs'
import { Memberships, Coins } from '../methods'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'
import GenerateQR from './GenerateQR'
import ConfirmMessage from './ConfirmMessage'
import FormPay from './FormPay'

const ShowQR = ({
  type,
  loading,
  createPaymentLink,
}: {
  type: Memberships
  loading: boolean
  createPaymentLink: (type: Memberships, coin: Coins) => void
}) => {
  // Se obtiene el usuario
  const user = useAppSelector((state) => state.auth.user)

  // Obtener fecha de expiración
  const expires_at = user?.membership_expires_at
  const expiredDate = expires_at ? dayjs(expires_at) : null
  // Obtener fecha de mañana
  const tomorrowDate = dayjs().add(1, 'days')

  // Sí la fecha de expiración es el siguiente día
  if (
    expires_at &&
    expiredDate &&
    expiredDate.isBefore(tomorrowDate.toDate()) &&
    !user.payment_link
  )
    return (
      <GenerateQR
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    )

  // Sí el pago sigue pendiente
  if (user.payment_link && user.payment_link?.status == 'pending')
    return (
      <FormPay
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    )

  // Sí el pago fue completado
  if (user.payment_link && user.payment_link?.status == 'confirming')
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (user.membership_status == 'paid') return null

  // Sí no se a creado la dirección de pago...
  if (!user.payment_link)
    return (
      <GenerateQR
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    )

  return <Spinner />
}

export default ShowQR
