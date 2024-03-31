import Supreme from './supreme'
import Pro from './pro'
import IBO from './ibo'
import PackProSupreme from './pack_pro_supreme'
import Starter from './starter'
import { useAppSelector } from '@/store'
import CryptoElite from './crypto-elite'
import TopriceXpert from './toprice-xpert'

const PayMembership = () => {
  const user = useAppSelector((state) => state.auth.user)

  const is_active_toprice_xpert =
    user?.subscription?.toprice_xpert &&
    user?.subscription?.toprice_xpert.status == 'paid'

  const is_active_crypto_elite =
    user?.subscription?.crypto_elite &&
    user?.subscription?.crypto_elite.status == 'paid'

  const high_ticket = is_active_crypto_elite || is_active_toprice_xpert

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3>Tus membresias</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-5">
        {user.is_new && <Starter />}
        {!high_ticket && <Pro />}
        {!high_ticket && <Supreme />}
        <IBO />
        <CryptoElite />
        <TopriceXpert />
      </div>

      {!high_ticket && <PackProSupreme />}
    </div>
  )
}

export default PayMembership
