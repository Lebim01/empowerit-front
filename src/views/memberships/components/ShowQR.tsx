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
  const expires_at =
    user?.subscription &&
    user?.subscription[type] &&
    user?.subscription[type]?.expires_at
  const expiredDate = dayjs((expires_at?.seconds || 0) * 1000)
  // Obtener fecha de mañana
  const tomorrowDate = dayjs().add(1, 'days')

  // Sí la fecha de expiración es el siguiente día
  if (
    expires_at &&
    expiredDate.isBefore(tomorrowDate.toDate()) &&
    !user.subscription[type]?.payment_link
  )
    return (
      <GenerateQR
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    )

  // Sí el pago sigue pendiente
  if (
    user.subscription &&
    user.subscription[type] &&
    user.subscription[type]?.payment_link &&
    user.subscription[type]?.payment_link?.status == 'pending'
  )
    return (
      <FormPay
        type={type}
        loading={loading}
        createPaymentLink={createPaymentLink}
      />
    )

  // Sí el pago fue completado
  if (
    user.subscription &&
    user.subscription[type] &&
    user.subscription[type]?.payment_link &&
    user.subscription[type]?.payment_link?.status == 'confirming'
  )
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (
    user.subscription &&
    user.subscription[type] &&
    user.subscription[type]?.status == 'paid'
  )
    return null

  // Sí no se a creado la dirección de pago...
  if (user.subscription && !user.subscription[type]?.payment_link)
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
