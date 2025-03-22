import FranchiseProduct from './components/FranchiseTravel'
import { MEMBERSHIPS_TRAVEL } from './data/MembershipsProductsData'

export default function MembershipsProduct() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-3xl">Franquicias de Viaje</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
          {MEMBERSHIPS_TRAVEL.map((membership, index) => (
            <FranchiseProduct
              key={index}
              image={membership.image}
              name={membership.name}
              binary_points={membership.binary_points}
              range_points={membership.range_points}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
