import { useEffect, useState } from 'react'
import { Button, Input } from '@/components/ui'
import useTimer from '@/hooks/useTimer'
import dayjs from 'dayjs'
import { onSnapshot, collection } from 'firebase/firestore'
import { BsClock, BsWallet } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { Coins, Memberships } from '../methods'
import { useAppSelector } from '@/store'
import useClipboard from '@/utils/hooks/useClipboard'
import { getPaidAmount } from '@/services/Memberships'
import { db } from '@/configs/firebaseConfig'
import ButtonSwapCurrency, { currencyIcon } from './ButtonSwapCurrency'

const FormPay = ({
  type,
  createPaymentLink,
  loading,
}: {
  type: Memberships
  createPaymentLink: (type: Memberships, coin: Coins) => void
  loading: boolean
}) => {
  const user = useAppSelector((state) => state.auth.user)
  const address = user.subscription[type]?.payment_link?.address
  const amountcrypto = user.subscription[type]?.payment_link?.amount
  const expires_at = user.subscription[type]?.payment_link!.expires_at
  const qr = user.subscription[type]?.payment_link?.qr
  const [amount, setAmount] = useState(0)
  const [amountChanged, setAmountChanged] = useState(false)

  const { copy } = useClipboard()

  const isExpired = dayjs(
    expires_at?.seconds ? expires_at?.seconds * 1000 : null
  ).isBefore(dayjs())

  /**
   * Calcular monto pendiente a pagar
   */
  const calculatePenfindAmount = async () => {
    // Obtener el monto total
    const totalAmount = Number(user.subscription[type]?.payment_link?.amount)

    try {
      // Obtener el monto ya pagado
      const paidAmount = await getPaidAmount(
        user.uid ? user.uid : '',
        address ? address : ''
      )

      // Obtener el faltante
      const result: number = totalAmount - paidAmount

      // Redondearlo
      const decimals = 8
      const roundedNumber =
        Math.ceil(result * Math.pow(10, decimals)) / Math.pow(10, decimals)

      if (paidAmount > 0) setAmountChanged(true)
      setAmount(roundedNumber)
    } catch (e) {
      console.error('Error al calcular el monto pendiente: ', e)
      setAmount(totalAmount)
    }
  }

  useEffect(() => {
    if (user.uid) {
      const unsub = onSnapshot(
        collection(db, `users/${user.uid}/transactions`),
        () => {
          calculatePenfindAmount()
        }
      )
      return () => unsub()
    }
  }, [user.uid])

  useEffect(() => {
    if (
      address &&
      user.subscription &&
      user.subscription[type] &&
      user.subscription[type]?.payment_link
    ) {
      setAmount(Number(user.subscription[type]?.payment_link?.amount) || 0)
    }
  }, [address, amountcrypto])

  // Obtener tiempo que se ocupa
  const timer = useTimer(
    user.subscription[type] &&
      user.subscription[type]!.payment_link &&
      expires_at &&
      !amountChanged
      ? expires_at.seconds * 1000
      : undefined
  )

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2 items-center">
        <span>{user.email}</span>

        {isExpired && !amountChanged ? null : (
          <div>
            <img src={qr} className="h-[150px] w-[150px]" />
          </div>
        )}

        <Input
          readOnly
          prefix={<BsWallet />}
          value={isExpired && !amountChanged ? '' : address}
          suffix={
            <div
              className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
              onClick={() => copy(address!)}
            >
              <FiCopy />
            </div>
          }
        />

        <div
          className={
            !(isExpired || amountChanged)
              ? 'grid grid-cols-[30%_1fr] gap-x-4 w-full'
              : 'grid gap-x-4 w-full'
          }
        >
          {!(isExpired || amountChanged) ? (
            <Input readOnly prefix={<BsClock />} value={timer} />
          ) : null}
          <Input
            readOnly
            prefix={
              currencyIcon[
                user.subscription[type]?.payment_link?.currency || 'BTC'
              ]
            }
            value={isExpired && !amountChanged ? '' : amount.toFixed(8)}
            suffix={
              <div className="flex items-center space-x-2">
                <span>{user.subscription[type]?.payment_link?.currency}</span>{' '}
                <div
                  className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                  onClick={() => copy(amount.toFixed(8) || '')}
                >
                  <FiCopy />
                </div>
              </div>
            }
          />
        </div>

        <div className="w-full flex justify-end">
          {user.subscription[type]!.payment_link!.currency != 'BTC' && (
            <ButtonSwapCurrency
              currency="BTC"
              createPaymentLink={createPaymentLink}
              type={type}
            />
          )}
          {user.subscription[type]!.payment_link!.currency != 'LTC' && (
            <ButtonSwapCurrency
              currency="LTC"
              createPaymentLink={createPaymentLink}
              type={type}
            />
          )}
        </div>
      </div>
      {amountChanged ? (
        <div>
          <p className="text-red-400 font-bold text-center">
            Se detectó un pago
            <br />
            que no cubre la totalidad,
            <br />
            favor de pagar el resto.
          </p>
        </div>
      ) : null}
      {isExpired && !amountChanged ? (
        <div>
          <p className="text-red-400 font-bold text-center">
            QR de pago caducado.
          </p>
        </div>
      ) : null}
      <div>
        <p className="text-center">
          La membresia se activará automaticamente
          <br />
          despues de confirmar el pago.
        </p>
      </div>
      {isExpired && !amountChanged ? (
        <div className="flex justify-end space-x-1">
          <Button
            loading={loading}
            disabled={!isExpired}
            onClick={() =>
              createPaymentLink(
                type,
                user.subscription[type]!.payment_link!.currency
              )
            }
          >
            Calcular de nuevo
          </Button>
        </div>
      ) : null}
      {user.subscription[type] && expires_at && (
        <span className="text-xs text-gray-300">
          Tu membresia expiró el:{' '}
          {dayjs(expires_at!.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      )}
    </>
  )
}

export default FormPay
