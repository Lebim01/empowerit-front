import { FranchiseAutomaticProps } from '../FranchiseAutomatic'

export const AUTOMATIC_FRANCHISE: FranchiseAutomaticProps[] = [
  {
    name: 'FA1000',
    binary_points: 100,
    range_points: 200,
    cap: 2000,
    image: '/img/Franchises/FA1000.png',
  },
  {
    name: 'FA2000',
    binary_points: 200,
    range_points: 400,
    cap: 4000,
    image: '/img/Franchises/FA2000.png',
  },
  {
    name: 'FA5000',
    binary_points: 500,
    range_points: 1000,
    cap: 10000,
    image: '/img/Franchises/FA5000.png',
  },
]

export const AUTOMATIC_FRANCHISES_PRICES: Record<string, number> = {
  FA1000: 1000,
  FA2000: 2000,
  FA5000: 5000,
}
