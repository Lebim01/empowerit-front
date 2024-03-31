import { useState } from 'react'
import {
  getRestDaysMembership,
  getRestHoursMembership,
} from '@/utils/membership'
import classNames from 'classnames'
import { Coins, Memberships, createPaymentLink } from './methods'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'

const IBO = () => {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const _createPaymentLink = async (type: Memberships, currency: Coins) => {
    try {
      if (loading) return
      setLoading(true)
      await createPaymentLink(user.uid!, type, currency)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const is_active_ibo =
    user?.subscription?.ibo && user.subscription?.ibo?.status == 'paid'
  const membership_ibo_rest_days = getRestDaysMembership(
    user?.subscription?.ibo?.expires_at
  )

  return (
    <div
      className={classNames(
        'rounded-md w-full md:w-[450px] ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        is_active_ibo && 'shadow-md shadow-purple-500/50 ring-purple-200',
        !is_active_ibo && 'ring-gray-200'
      )}
    >
      <img
        src="/membership/ibo.PNG"
        className={classNames(
          'aspect-video object-contain transition-all duration-75',
          !is_active_ibo && 'brightness-50 contrast-50'
        )}
      />
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
        <span className="text-right">Membresía: </span>
        <span className="font-bold">IBO</span>

        {is_active_ibo && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-green-600">Activa</span>
            <span className="text-right">Restante:</span>
            <span className="font-bold">
              {membership_ibo_rest_days} días y{' '}
              {getRestHoursMembership(
                membership_ibo_rest_days,
                user.subscription.ibo?.expires_at
              )}{' '}
              horas
            </span>
            <span className="text-right">Expira el:</span>
            <span className="font-bold">
              {dayjs(
                (user.subscription.ibo?.expires_at?.seconds || 0) * 1000
              ).format('DD/MMMM/YYYY HH:mm')}
            </span>
          </>
        )}

        {!is_active_ibo && (
          <>
            <span className="text-right">Duración:</span>
            <span className="font-bold">112 días</span>
            <span className="text-right">Total:</span>
            <span className="font-bold">$ 30 USD</span>
          </>
        )}
      </div>

      <ShowQR
        type="ibo"
        loading={loading}
        createPaymentLink={_createPaymentLink}
      />
    </div>
  )
}

export default IBO
