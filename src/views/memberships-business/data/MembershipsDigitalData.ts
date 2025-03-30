import { BuisinessFranchises } from '@/views/memberships/methods'

export interface MembershipsBusinessProps {
  name: BuisinessFranchises
  binary_points: number
  range_points: number
  image: string
}

export const MEMBERSHIPS_BUSINESS: MembershipsBusinessProps[] = [
  {
    name: 'FB79',
    binary_points: 40,
    range_points: 79,
    image: '/img/memberships/FB79.jpg',
  },
  {
    name: 'FB200',
    binary_points: 100,
    range_points: 200,
    image: '/img/memberships/FB200.jpg',
  },
  {
    name: 'FB500',
    binary_points: 250,
    range_points: 500,
    image: '/img/memberships/FB500.jpg',
  },
]
