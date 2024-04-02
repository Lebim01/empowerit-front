import { Button, Select } from '@/components/ui'
import { Coins, Memberships } from '../methods'
import { useState } from 'react'
import { SiCashapp } from 'react-icons/si'
import { Periods } from '../membership'

const GenerateQR = ({
  type,
  loading,
  createPaymentLink,
  options,
}: {
  type: Memberships
  loading: boolean
  createPaymentLink: (type: Memberships, coin: Coins, period: Periods) => void
  options: { value: Periods; label: string }[]
}) => {
  const [period, setPeriod] = useState<Periods>('monthly')
  const [showCoin, setShowCoin] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const _create = (coin: Coins) => {
    try {
      setDisabled(true)
      createPaymentLink(type, coin, period)
    } catch (err) {
      console.error(err)
    } finally {
      setDisabled
    }
  }

  const _createOpenPay = (coin: 'MXN') => {
    try {
      setDisabled(true)
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
      <div className="flex flex-col space-y-2">
        {showCoin && (
          <Select
            options={options}
            value={options.find((r) => r.value == period)}
            onChange={(option) => setPeriod(option?.value || 'montly')}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Button
            className="h-max"
            disabled={disabled}
            onClick={() => _createOpenPay('MXN')}
          >
            <div className="flex flex-col items-center space-y-4">
              <SiCashapp height={50} width={50} className="h-[50px] w-[50px]" />
              <span>Fiat (MXN)</span>
            </div>
          </Button>
          <Button
            className="h-max"
            disabled={disabled}
            onClick={() => _create('LTC')}
          >
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

export default GenerateQR
