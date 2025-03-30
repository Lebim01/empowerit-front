import { TravelFranchises } from '@/views/memberships/methods'

export interface MembershipsTravelProps {
  name: TravelFranchises
  binary_points: number
  range_points: number
  image: string
}

export const MEMBERSHIPS_TRAVEL: MembershipsTravelProps[] = [
  {
    name: 'FT1499',
    binary_points: 374,
    range_points: 1499,
    image: '/img/memberships/FT1499.jpg',
  },
  {
    name: 'FT2499',
    binary_points: 624,
    range_points: 2499,
    image: '/img/memberships/FT2499.jpg',
  },
]
