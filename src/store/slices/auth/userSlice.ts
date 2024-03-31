import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Coins } from '@/views/memberships/methods'

type MembershipStatus = {
  start_at: { seconds: number } | null
  expires_at: { seconds: number } | null
  status: null | 'paid' | 'expired'

  payment_link?: {
    amount: string
    expires_at: { seconds: number }
    qr: string
    currency: Coins
    status: 'pending' | 'confirming'
    address: string
  }
}
export type UserState = {
  is_admin?: boolean
  uid?: string
  avatar?: string
  name?: string
  birthdate?: string
  country?: string
  state?: string
  city?: string
  whatsapp?: number
  telegram?: number
  instagram?: string
  discord?: string
  last_name?: string
  email?: string
  authority?: string[]
  sponsor?: string
  sponsor_id?: string
  left?: string
  right?: string
  wallet_bitcoin?: string
  wallet_litecoin?: string
  bank_account?: string
  rfc?: string
  subscription_expires_at?: { seconds: number } | null
  left_points: number
  right_points: number
  left_binary_user_id: string | null
  right_binary_user_id: string | null
  rank: string
  max_rank?: {
    key: string
    order: number
    display: string
  }
  is_new: boolean
  position: 'left' | 'right'
  user_profile?: string

  membership: string | null

  payment_link?: {
    [type: string]: any
  }
  is_pending_complete_personal_info: boolean
}

const initialState: UserState = {
  uid: '',
  avatar: '',
  name: '',
  birthdate: '',
  country: '',
  state: '',
  city: '',
  whatsapp: 0,
  telegram: 0,
  last_name: '',
  email: '',
  authority: [],
  sponsor: '',
  sponsor_id: '',
  left: '',
  right: '',
  subscription_expires_at: null,
  left_points: 0,
  right_points: 0,
  left_binary_user_id: null,
  right_binary_user_id: null,
  rank: '',
  is_new: false,
  position: 'left',
  membership: null,
  is_pending_complete_personal_info: true,
}

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState & any>) {
      const payload = action.payload

      if (payload) {
        console.log(payload)
        state.uid = payload.uid
        state.avatar = payload.avatar
        state.email = payload.email
        state.name = payload.name
        state.birthdate = payload.birthdate
        state.country = payload.country
        state.state = payload.state
        state.city = payload.city
        state.whatsapp = payload.whatsapp
        state.telegram = payload.telegram
        state.instagram = payload.instagram
        state.discord = payload.discord
        state.last_name = payload.last_name
        state.max_rank = payload.max_rank
        state.is_admin = payload.is_admin

        const roles = []
        /**
         * Asigna roles al usuario basado en su membresía y perfil de administrador.
         * Si el usuario es administrador, se le asignaran los roles ADMIN y USER
         * Si el usuario es educador, se le asignará el rol de EDUCATOR
         * Si el usuario tiene membresía PRO activa, se le asignará el rol de USER.
         *    En caso de que el usuario tenga una membresía STARTER y PRO activas a la vez, se le dará prioridad a la membresía PRO.
         */
        if (payload.is_admin) {
          roles.push('ADMIN', 'USER')
        } else if (
          payload.subscription?.starter?.status === 'paid' &&
          payload.subscription?.pro?.status !== 'paid'
        ) {
          roles.push('STARTER')
        } else {
          roles.push(payload.user_profile === 'educator' ? 'EDUCATOR' : 'USER')
        }

        state.authority = roles
        state.sponsor = payload.sponsor
        state.sponsor_id = payload.sponsor_id
        state.subscription_expires_at = payload.subscription_expires_at
          ? { seconds: payload.subscription_expires_at.seconds }
          : null
        state.left = payload.left
        state.left_binary_user_id = payload.left_binary_user_id
        state.left_points = payload.left_points
        state.right = payload.right
        state.right_binary_user_id = payload.right_binary_user_id
        state.right_points = payload.right_points
        state.wallet_bitcoin = payload.wallet_bitcoin
        state.bank_account = payload.bank_account
        state.rfc = payload.rfc
        state.wallet_litecoin = payload.wallet_litecoin ?? ''
        state.rank = payload.rank
        state.position = payload.position ?? 'right'
        state.is_new = payload.is_new ?? false
        state.payment_link = payload.payment_link
        state.membership = payload.membership
      }
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
