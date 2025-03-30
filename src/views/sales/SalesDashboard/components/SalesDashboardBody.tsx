import Loading from '@/components/shared/Loading'
import Rank from './components/Rank'
import Summary from './components/Summary'
import Links from './components/Links'
import { useAppSelector } from '@/store'
import CapSlider from './CapSlider'
import ServicesTimer from './components/ServicesTimer'

const SalesDashboardBody = () => {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <Loading>
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img
          src="/img/dashboard/banner-1-empowerit-top.jpg"
          className="w-full"
        />
      </div>
      <ServicesTimer />
      <Rank />
      {user &&
      user.membership_cap_limit &&
      typeof user.membership_cap_current === 'number' &&
      typeof user.membership_cap_limit === 'number' ? (
        <CapSlider />
      ) : null}
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img
          src="/img/dashboard/banner-horizontal-emp-top-2.jpg"
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-x-4 gap-y-4">
        <Summary />
        <Links />
      </div>
    </Loading>
  )
}

export default SalesDashboardBody
