import { useState } from 'react'
import { useAppSelector } from '@/store'
import {
  getRestDaysMembership,
  getRestHoursMembership,
} from '@/utils/membership'
import classNames from 'classnames'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'
import { Coins, Memberships, createPaymentLink } from './methods'

const Supreme = () => {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const _createPaymentLink = async (type: Memberships, coin: Coins) => {
    try {
      if (loading) return
      setLoading(true)
      await createPaymentLink(user.uid!, type, coin)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const is_active_supreme =
    user?.subscription?.supreme && user?.subscription?.supreme.status == 'paid'
  const membership_supreme_rest_days = getRestDaysMembership(
    user?.subscription?.supreme?.expires_at
  )

  return (
    <div
      className={classNames(
        'rounded-md w-full md:w-[450px] ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        is_active_supreme && 'shadow-md shadow-amber-700/50 ring-amber-300',
        !is_active_supreme && 'ring-gray-200'
      )}
    >
      <img
        src="/membership/supreme.PNG"
        className={classNames(
          'aspect-video object-contain transition-all duration-75',
          !is_active_supreme && 'brightness-50 contrast-50'
        )}
      />
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
        <span className="text-right">Membresía: </span>
        <span className="font-bold">SUPREME</span>

        {is_active_supreme && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-green-600">Activa</span>
            <span className="text-right">Restante:</span>
            <span className="font-bold">
              {membership_supreme_rest_days} días y{' '}
              {getRestHoursMembership(
                membership_supreme_rest_days,
                user.subscription.supreme?.expires_at
              )}{' '}
              horas
            </span>
            <span className="text-right">Expira el:</span>
            <span className="font-bold">
              {dayjs(
                (user.subscription.supreme?.expires_at?.seconds || 0) * 1000
              ).format('DD/MMMM/YYYY HH:mm')}
            </span>
          </>
        )}

        {!is_active_supreme && (
          <>
            <span className="text-right">Duración:</span>
            <span className="font-bold">168 días</span>
            <span className="text-right">Total:</span>
            <span className="font-bold">$ 100 USD</span>
          </>
        )}
      </div>

      <ShowQR
        type="supreme"
        loading={loading}
        createPaymentLink={_createPaymentLink}
      />
    </div>
  )
}

export default Supreme
