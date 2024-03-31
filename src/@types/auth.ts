export type SignInCredential = {
  email: string
  password: string
}

export type SignInResponse = {
  token: string
  user: {
    uid?: string
    name: string
    authority: string[]
    avatar: string
    email: string
  }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  uid?: string
  name: string
  email: string
  password: string
  position: 'left' | 'right'
  sponsor: string
  sponsor_id: string
  subscription_expires_at?: Date
  action?: string
  rank?: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}

export type UserDoc = {
  left: string
  right: string
  id: string
  position: 'left' | 'right'
  avatar: string
  is_admin: boolean
  name?: string
  email?: string
  sponsor?: string
  subscription_expires_at?: {
    seconds: number
  }
  has_scholarship: boolean;
  subscription: {
    pro?: {
      created_at: { seconds: number } | null
      expires_at: { seconds: number } | null
      status: null | 'paid' | 'expired'

      payment_link?: {
        amount: string
        expires_at: { seconds: number }
        qr: string
        status: 'pending' | 'confirming'
        address: string
      }
    }
    ibo?: {
      created_at: { seconds: number } | null
      expires_at: { seconds: number } | null
      status: null | 'paid' | 'expired'

      payment_link?: {
        amount: string
        expires_at: { seconds: number }
        qr: string
        status: 'pending' | 'confirming'
        address: string
      }
    }
    supreme?: {
      created_at: { seconds: number } | null
      expires_at: { seconds: number } | null
      status: null | 'paid' | 'expired'

      payment_link?: {
        amount: string
        expires_at: { seconds: number }
        qr: string
        status: 'pending' | 'confirming'
        address: string
      }
    }
  },
  rank?: string
}
