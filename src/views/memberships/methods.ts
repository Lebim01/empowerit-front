export type BuisinessFranchises = 'FB79' | 'FB200' | 'FB500'

export type TravelFranchises = 'FT1499' | 'FT2499'

export type AutomaticFranchises = 'FA1000' | 'FA2000' | 'FA5000'

export type Memberships =
  | BuisinessFranchises
  | AutomaticFranchises
  | TravelFranchises

export type Coins = 'MXN' | 'USDT'

export type Method = 'fiat' | 'coinpayments'

export const createPaymentLink = async (
  user_id: string,
  type: Memberships,
  coin: Coins,
  method: Method,
  buyer_email: string
) => {
  try {
    // Crear dirección de pago
    if (method == 'fiat') {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddress/${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            type,
            coin,
          }),
        }
      )
    }

    if (method == 'coinpayments') {
      await fetch(
        `${import.meta.env.VITE_API_URL}/coinpayments/create-transaction/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            type,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            cmd: 'create_transaction',
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export const createPaymentLinkForCredits = async (
  user_id: string,
  amount: number,
  coin: Coins,
  method: Method,
  buyer_email: string
) => {
  try {
    // Crear dirección de pago
    if (method == 'fiat') {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddressForCredits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            coin,
            amount,
          }),
        }
      )
    }
    if (method == 'coinpayments') {
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/coinpayments/create-transaction-credits/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            amount,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            cmd: 'create_transaction',
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}
