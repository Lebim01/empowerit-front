import classNames from 'classnames'
import { Coins, Memberships, createPaymentLink } from './methods'
import { useState, FC } from 'react'
import { useAppSelector } from '@/store'
import {
  getRestDaysMembership,
  getRestHoursMembership,
} from '@/utils/membership'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'

type Props = {
  disabled?: boolean
}

const CryptoElite: FC<Props> = (props) => {
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

  const is_active_crypto_elite =
    user?.subscription?.crypto_elite &&
    user?.subscription?.crypto_elite.status == 'paid'
  const membership_crypto_elite_rest_days = getRestDaysMembership(
    user.subscription?.crypto_elite?.expires_at
  )

  return (
    <div
      className={classNames(
        'rounded-md w-full md:w-[450px] ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        'ring-gray-200'
      )}
    >
      <img
        src="/membership/crypto-elite.png"
        className={classNames(
          'aspect-video object-contain transition-all duration-75',
          !is_active_crypto_elite && 'brightness-50 contrast-50'
        )}
      />

      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
        <span className="text-right">Membresía: </span>
        <span className="font-bold">CRYPTO ELITE X</span>

        {is_active_crypto_elite && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-green-600">Activa</span>
            <span className="text-right">Restante:</span>
            <span className="font-bold">
              {membership_crypto_elite_rest_days} días y{' '}
              {getRestHoursMembership(
                membership_crypto_elite_rest_days,
                user.subscription.crypto_elite?.expires_at
              )}{' '}
              horas
            </span>
            <span className="text-right">Expira el:</span>
            <span className="font-bold">
              {dayjs(
                user.subscription.crypto_elite!.expires_at!.seconds * 1000
              ).format('DD/MMMM/YYYY HH:mm')}
            </span>
          </>
        )}

        {!is_active_crypto_elite && (
          <>
            <span className="text-right">Duración:</span>
            <span className="font-bold">168 días</span>
            <span className="text-right">Total:</span>
            <span className="font-bold">$ 800 USD</span>
          </>
        )}
      </div>

      <ShowQR
        type="crypto_elite"
        loading={loading}
        createPaymentLink={_createPaymentLink}
      />
    </div>
  )
}

export default CryptoElite
