export interface MembershipsProductsProps {
  name: MembershipsProductsNames
  binary_points: number
  range_points: number
  image: string
  cap: number
}

export type MembershipsProductsNames = 'FP200' | 'FP300' | 'FP500'

export const MEMBERSHIPS_PRODUCT: MembershipsProductsProps[] = [
  {
    name: 'FP200',
    binary_points: 100,
    range_points: 200,
    image: '/img/memberships/fp1.png',
    cap: 500,
  },
  {
    name: 'FP300',
    binary_points: 150,
    range_points: 300,
    image: '/img/memberships/fp2.png',
    cap: 1000,
  },
  {
    name: 'FP500',
    binary_points: 250,
    range_points: 500,
    image: '/img/memberships/fp3.png',
    cap: 2000,
  },
]
