import { useState } from 'react'
import { useAppSelector } from '@/store'
import {
  getRestDaysMembership,
  getRestHoursMembership,
} from '@/utils/membership'
import classNames from 'classnames'
import { Coins, Memberships, createPaymentLink } from './methods'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'

const Starter = () => {
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

  const is_active_starter =
    user?.subscription?.starter && user?.subscription?.starter.status == 'paid'
  const membership_starter_rest_days = getRestDaysMembership(
    user.subscription?.starter?.expires_at
  )

  return (
    <div
      className={classNames(
        'rounded-md w-full md:w-[450px] ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        is_active_starter && 'shadow-md shadow-blue-700/50 ring-blue-300',
        !is_active_starter && 'ring-gray-200'
      )}
    >
      <img
        src="/membership/starter.png"
        className={classNames(
          'aspect-video object-contain transition-all duration-75',
          !is_active_starter && 'brightness-50 contrast-50'
        )}
      />

      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
        <span className="text-right">Membresía: </span>
        <span className="font-bold">STARTER</span>

        {is_active_starter && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-blue-600">Activa</span>
            <span className="text-right">Restante:</span>
            <span className="font-bold">
              {membership_starter_rest_days} días y{' '}
              {getRestHoursMembership(
                membership_starter_rest_days,
                user.subscription.starter?.expires_at
              )}{' '}
              horas
            </span>
            <span className="text-right">Expira el:</span>
            <span className="font-bold">
              {dayjs(
                user.subscription.starter!.expires_at!.seconds * 1000
              ).format('DD/MMMM/YYYY HH:mm')}
            </span>
          </>
        )}

        {!is_active_starter && (
          <>
            <span className="text-right">Duración:</span>
            <span className="font-bold">28 días</span>
            <span className="text-right">IBO:</span>
            <span className="font-bold">56 días</span>
            <span className="text-right">Total:</span>
            <span className="font-bold">$ 50 USD</span>
          </>
        )}
      </div>

      <ShowQR
        type="starter"
        loading={loading}
        createPaymentLink={_createPaymentLink}
      />
    </div>
  )
}

export default Starter
