import Header from '@/components/template/Header'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import { useAppSelector } from '@/store'
import { OPTIONS2 } from '@/utils/packs'
import { useState } from 'react'
import { Dialog } from '../ui'
import RechargeCreditsCard from './RechargeCreditsCard'

const HeaderActionsStart = () => {
  return (
    <>
      <MobileNav />
      <SideNavToggle />
    </>
  )
}

const HeaderActionsEnd = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)

  return (
    <>
      {user?.membership && (
        <div className="flex items-center">
          <p
            className="px-1 font-bold hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Agregar créditos
          </p>
          <p className="px-4 font-bold">{user.credits} créditos</p>
          <>
            <img
              src={`/img/Franchises/${user.membership}.png`}
              className="h-[50px] w-auto"
              width={80}
              height={80}
            />
            <span>{user.membership}</span>
          </>
          <Dialog isOpen={open} onClose={() => setOpen(false)}>
            <h3>Recarga créditos</h3>
            <RechargeCreditsCard />
          </Dialog>
        </div>
      )}
      <UserDropdown hoverable={false} />
    </>
  )
}

const ModernLayout = () => {
  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex flex-auto min-w-0">
        <SideNav />
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <Header
            className="border-b border-gray-200 dark:border-gray-700"
            headerEnd={<HeaderActionsEnd />}
            headerStart={<HeaderActionsStart />}
          />
          <View />
        </div>
      </div>
    </div>
  )
}

export default ModernLayout
