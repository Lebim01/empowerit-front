import dayjs from 'dayjs'

export type MembershipStatus = {
  
  pro: boolean;
  ibo: boolean;
  supreme: boolean;
  starter: boolean;
  crypto_elite: boolean;
  toprice_xpert: boolean;
};

export const getRestDaysMembership = (
  subscription_expires_at?: null | { seconds: number }
): number => {
  if (subscription_expires_at) {
    return dayjs(subscription_expires_at.seconds * 1000).diff(dayjs(), 'days')
  }
  return 0
}

export const getRestHoursMembership = (
  restDays: number,
  subscription_expires_at?: null | { seconds: number }
): number => {
  if (subscription_expires_at && restDays >= 0) {
    return (
      dayjs(subscription_expires_at.seconds * 1000).diff(dayjs(), 'hours') -
      restDays * 24
    )
  }
  return 0
}
