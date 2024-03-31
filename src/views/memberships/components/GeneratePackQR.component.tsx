import { Button } from '@/components/ui'
import { Coins, Memberships, PAYMENT_LINK_TYPE } from '../methods'
import { useState } from 'react'

const GeneratePackQR = ({
  type,
  loading,
  createPaymentLink,
}: {
  type: PAYMENT_LINK_TYPE
  loading: boolean
  createPaymentLink: (type: PAYMENT_LINK_TYPE, coin: Coins) => void
}) => {
  const [showCoin, setShowCoin] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const _create = (coin: Coins) => {
    try {
      setDisabled(true)
      createPaymentLink(type, coin)
    } catch (err) {
      console.error(err)
    } finally {
      setDisabled
    }
  }

  const selectCoin = () => {
    setShowCoin(true)
  }

  if (showCoin) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
        <Button
          className="h-max"
          disabled={disabled}
          onClick={() => _create('BTC')}
        >
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/img/btc-logo.png"
              height={50}
              width={50}
              className="h-[50px] w-[50px]"
            />
            <span>Bitcoin (BTC)</span>
          </div>
        </Button>
        <Button disabled={disabled} className="h-max" onClick={() => _create('LTC')}>
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/img/ltc-logo.svg"
              height={50}
              width={50}
              className="h-[50px] w-[50px]"
            />
            <span>Litecoin (LTC)</span>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button loading={loading} onClick={selectCoin}>
        Generar QR de Pago
      </Button>
    </div>
  )
}

export default GeneratePackQR
