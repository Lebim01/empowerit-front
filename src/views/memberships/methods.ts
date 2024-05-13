import { Periods } from './membership'

export type Memberships =
  | 'pro'
  | 'supreme'
  | 'alive-pack'
  | 'freedom-pack'
  | 'business-pack'
  | 'elite-pack'
  | 'vip-pack'
  | 'founder-pack'
  | '100-pack'
  | '300-pack'
  | '500-pack'
  | '1000-pack'
  | '2000-pack'
  
export type Coins = 'MXN' | 'LTC'

export enum PAYMENT_LINK_TYPE {
  PRO = 'pro',
  SUPREME = 'supreme',
  ALIVE_PACK = 'alive-pack',
  FREEDOM_PACK = 'freedom-pack',
  BUSINESS_PACK = 'business-pack',
  ELITE_PACK = 'elite-pack',
  VIP_PACK = 'vip-pack',
  FOUNDER_PACK = 'founder-pack',
}

export const createPaymentLink = async (
  user_id: string,
  type: Memberships,
  coin: Coins,
  period: Periods
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
          period,
        }),
      }
    )
  } catch (err) {
    console.error(err)
  }
}
