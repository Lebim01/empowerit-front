export type Memberships =
  | 'ibo'
  | 'pro'
  | 'supreme'
  | 'starter'
  | 'crypto_elite'
  | 'toprice_xpert'
export type Coins = 'BTC' | 'LTC' | 'XRP'

export enum PAYMENT_LINK_TYPE {
  IBO = 'ibo',
  PRO = 'pro',
  SUPREME = 'supreme',
  STARTER = 'starter',
  PRO_SUPREME = 'pro+supreme',
}

export const createPaymentLink = async (
  user_id: string,
  type: Memberships,
  coin: Coins
) => {
  try {
    // Crear dirección de pago
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
  } catch (err) {
    console.error(err)
  }
}

export const createPackagePaymentLink = async (
  user_id: string,
  type: PAYMENT_LINK_TYPE,
  coin: Coins
) => {
  try {
    // Crear dirección de pago
    await fetch(
      `${import.meta.env.VITE_API_URL}/subscriptions/createPaymentAddressPack`,
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
  } catch (err) {
    console.error(err)
  }
}
