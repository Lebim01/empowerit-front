import { GoArrowSwitch } from 'react-icons/go'
import { Coins } from '../methods'
import { SiCashapp } from 'react-icons/si'

export const currencyIcon = {
  USDT: (
    <img
      src="/img/usdt-logo.png"
      height={12}
      width={12}
      className="h-[12px] w-[12px]"
    />
  ),
  MXN: <SiCashapp />,
}

const ButtonSwapCurrency = ({
  currency,
  createPaymentLink,
  type,
}: {
  currency: Coins
  createPaymentLink: any
  type: string
}) => {
  return (
    <button
      className="border border-gray-200 rounded-lg p-2 flex items-center space-x-2 hover:bg-gray-200"
      title="Cambiar de moneda"
      onClick={() => createPaymentLink(type, currency)}
    >
      <span>
        <GoArrowSwitch />
      </span>
      <span>{currency}</span>
    </button>
  )
}

export default ButtonSwapCurrency
