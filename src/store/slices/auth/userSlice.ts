import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Coins } from '@/views/memberships/methods'
import dayjs from 'dayjs'

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
  left_points: number
  right_points: number
  left_binary_user_id: string | null
  right_binary_user_id: string | null
  rank: string
  max_rank?: string | null
  is_new: boolean
  position: 'left' | 'right'
  user_profile?: string

  membership: string | null
  membership_status: 'paid' | 'expired' | null
  membership_expires_at: string | null
  zip?: string
  address?: string
  customToken: string

  bond_presenter: number;
  bond_quick_start: number;

  payment_link?: {
    [type: string]: {
      amount: string
      expires_at: { seconds: number }
      qr: string
      currency: Coins
      status: 'pending' | 'confirming'
      address: string
    }
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
  left_points: 0,
  right_points: 0,
  left_binary_user_id: null,
  right_binary_user_id: null,
  rank: '',
  is_new: false,
  position: 'left',
  membership: null,
  membership_expires_at: null,
  membership_status: null,
  is_pending_complete_personal_info: true,
  customToken: '',
  bond_presenter: 0,
  bond_quick_start: 0
}

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState & any>) {
      const payload = action.payload

      if (payload) {
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
        state.last_name = payload.last_name
        state.max_rank = payload.max_rank
        state.is_admin = payload.is_admin
        state.address = payload.address
        state.zip = payload.zip
        state.customToken = payload.customToken

        const roles = []
        if (payload.is_admin) {
          roles.push('ADMIN', 'USER')
        } else {
          roles.push('USER')
        }

        state.authority = roles
        state.sponsor = payload.sponsor
        state.sponsor_id = payload.sponsor_id
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

        state.membership_status = payload.membership_status
        state.membership = payload.membership

        state.bond_quick_start = payload.bond_quick_start
        state.bond_presenter = payload.bond_presenter

        console.log(payload.membership_expires_at)
        state.membership_expires_at = payload.membership_expires_at
          ? typeof payload.membership_expires_at == 'string'
            ? payload.membership_expires_at
            : dayjs(payload.membership_expires_at.seconds * 1000).toISOString()
          : null
      }
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
