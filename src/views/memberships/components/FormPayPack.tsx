import { useEffect, useState } from 'react'
import { Button, Input } from '@/components/ui'
import useTimer from '@/hooks/useTimer'
import dayjs from 'dayjs'
import { onSnapshot, collection } from 'firebase/firestore'
import { BsClock, BsWallet } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { useAppSelector } from '@/store'
import useClipboard from '@/utils/hooks/useClipboard'
import { getPaidAmount } from '@/services/Memberships'
import { db } from '@/configs/firebaseConfig'
import ConfirmMessage from './ConfirmMessage'
import { Coins, PAYMENT_LINK_TYPE } from '../methods'
import GeneratePackQR from './GeneratePackQR.component'
import ButtonSwapCurrency, { currencyIcon } from './ButtonSwapCurrency'

const FormPayPack = ({
  type,
  createPaymentLink,
  loading,
}: {
  type: PAYMENT_LINK_TYPE
  createPaymentLink: (type: PAYMENT_LINK_TYPE, currency: Coins) => void
  loading: boolean
}) => {
  const user = useAppSelector((state) => state.auth.user)
  const address =
    user.payment_link && user.payment_link[type]
      ? user.payment_link[type].address
      : null
  const amountcrypto =
    user.payment_link && user.payment_link[type]
      ? user.payment_link[type].amount
      : null
  const expires_at =
    user.payment_link && user.payment_link[type]
      ? user.payment_link[type].expires_at
      : null
  const qr =
    user.payment_link && user.payment_link[type]
      ? user.payment_link[type].qr
      : null
  const currency: null | Coins =
    user.payment_link && user.payment_link[type]
      ? user.payment_link[type].currency
      : null
  const [amount, setAmount] = useState(0)
  const [amountChanged, setAmountChanged] = useState(false)
  const [showCoin, setShowCoin] = useState(false)

  const selectCoin = () => {
    setShowCoin(true)
  }

  const { copy } = useClipboard()

  const isSetted = address !== null
  const isExpired =
    !expires_at || dayjs(expires_at?.seconds * 1000 || null).isBefore(dayjs())

  /**
   * Calcular monto pendiente a pagar
   */
  const calculatePendingAmount = async () => {
    // Obtener el monto total
    if (!user.payment_link) return

    const totalAmount = Number(user.payment_link[type].amount)

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
      const multiple = Math.pow(10, decimals)
      const roundedNumber = Math.ceil(result * multiple) / multiple

      setAmountChanged(paidAmount > 0)
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
          calculatePendingAmount()
        }
      )
      return () => unsub()
    }
  }, [user.uid])

  useEffect(() => {
    if (address && user.payment_link && user.payment_link[type]) {
      setAmount(Number(amountcrypto))
    }
  }, [address, amountcrypto])

  // Obtener tiempo que se ocupa
  const timer = useTimer(
    user.payment_link && user.payment_link[type] && expires_at && !amountChanged
      ? expires_at.seconds * 1000
      : undefined
  )

  if (isSetted && amount <= Number(0)) {
    return <ConfirmMessage />
  }

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2 items-center">
        {isSetted && <span>{user.email}</span>}

        {isExpired && !amountChanged ? null : (
          <img src={qr || undefined} className="h-[150px] w-[150px]" />
        )}

        {isSetted && (
          <>
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
                prefix={currency && currencyIcon[currency]}
                value={isExpired && !amountChanged ? '' : amount.toFixed(8)}
                suffix={
                  <div className="flex items-center space-x-2">
                    <span>{currency}</span>{' '}
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
          </>
        )}

        <div className="w-full flex justify-end">
          {user.payment_link &&
            user.payment_link[type] &&
            user.payment_link[type].currency != 'MXN' && (
              <ButtonSwapCurrency
                currency="MXN"
                createPaymentLink={createPaymentLink}
                type={type}
              />
            )}
          {user.payment_link &&
            user.payment_link[type] &&
            user.payment_link[type].currency != 'LTC' && (
              <ButtonSwapCurrency
                currency="LTC"
                createPaymentLink={createPaymentLink}
                type={type}
              />
            )}
        </div>
      </div>

      {amountChanged && Number(amount) > 0 ? (
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
      {isExpired && !amountChanged && isSetted ? (
        <div>
          <p className="text-red-400 font-bold text-center">
            QR de pago caducado.
          </p>
        </div>
      ) : null}
      {amountChanged && Number(amount) <= 0 && (
        <div>
          <p className="text-center">
            La membresia se activará automaticamente
            <br />
            despues de confirmar el pago.
          </p>
        </div>
      )}
      {!isSetted && (
        <GeneratePackQR
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
        />
        // <div>
        //   <Button
        //     loading={loading}
        //     onClick={() => createPaymentLink(type, currency)}
        //   >
        //     Generar QR de Pago
        //   </Button>
        // </div>
      )}
      {isSetted && isExpired && !amountChanged ? (
        <div className="flex justify-end space-x-1">
          <Button
            loading={loading}
            disabled={!isExpired}
            onClick={() => createPaymentLink(type, currency!)}
          >
            Calcular de nuevo
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default FormPayPack
