import { useEffect, useState } from 'react'

import Loading from '@/components/shared/Loading'
import Events from './components/Events'
import Rank from './components/Rank'
import Summary from './components/Summary'
import Links from './components/Links'
import Goals from './components/Goals'
import Charts from './components/Charts'
import { Dialog, Notification, toast } from '@/components/ui'
import SocialMediaRedirection from './components/SocialMediaRedirection'
import WelcomeForm from '@/views/account/components/WelcomeForm'

import { useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { doc, onSnapshot } from 'firebase/firestore'
import { getRestDaysMembership } from '@/utils/membership'

const modalName = 'modal-1'

const SalesDashboardBody = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [data, setData] = useState<any>({})

  const userLogged = useAppSelector((state) => state.auth.user)

  const validateUserData = (userData: any) => {
    const requiredFields = [
      'name',
      'email',
      'country',
      'state',
      'city',
      'birthdate',
    ]

    for (const field of requiredFields) {
      const value = userData[field]

      if (typeof value === 'string' && value.trim() === '') {
        return false
      }

      if (typeof value === 'number' && isNaN(value)) {
        return false
      }

      if (value instanceof Date && isNaN(value.getTime())) {
        return false
      }

      if (value === null || value === undefined) {
        return false
      }
    }

    return true
  }

  const [openWelcomeModal, setOpenWelcomeModal] = useState(
    !validateUserData(userLogged) || false
  )
  useEffect(() => {
    const isModal = window.localStorage.getItem(modalName)

    if (userLogged && userLogged.uid) {
      setOpenWelcomeModal(!validateUserData(userLogged))

      if (!userLogged.is_admin)
        if (!isModal && !openWelcomeModal) setIsOpenModal(true)
    }
  }, [userLogged.uid])

  useEffect(() => {
    if (user.uid) {
      const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        setData(snap.data())
        verifyMembershipExpiration()
      })
      return () => {
        unsub1()
      }
    }
  }, [user.uid])

  const closeModal = () => {
    window.localStorage.setItem(modalName, '1')
    setIsOpenModal(false)
    setOpenWelcomeModal(false)
  }

  const checkSubscription = (user: any, type: string) => {
    const isActive =
      user?.subscription?.[type] && user.subscription[type].status === 'paid'
    const restDays = getRestDaysMembership(
      user?.subscription?.[type]?.expires_at
    )
    return { isActive, restDays }
  }

  const createNotification = (title: string, type: any, duration: number) => {
    toast.push(
      <Notification closable title={title} type={type} duration={duration} />
    )
  }

  const checkProSubscription = () => {
    if (
      checkSubscription(user, 'pro').isActive &&
      checkSubscription(user, 'pro').restDays <= 5
    ) {
      const title = `Su membresía de tipo Pro está por vencer. ${
        checkSubscription(user, 'pro').restDays
      } días restantes`
      const type =
        checkSubscription(user, 'pro').restDays > 3 ? 'warning' : 'danger'
      createNotification(title, type, 600000)
    }
  }

  const checkSupremeSubscription = () => {
    if (
      checkSubscription(user, 'supreme').isActive &&
      checkSubscription(user, 'supreme').restDays <= 5
    ) {
      const title = `Su membresía de tipo Supreme está por vencer. ${
        checkSubscription(user, 'supreme').restDays
      } días restantes`
      const type =
        checkSubscription(user, 'supreme').restDays > 3 ? 'warning' : 'danger'
      createNotification(title, type, 600000)
    }
  }

  const checkIboSubscription = () => {
    if (
      checkSubscription(user, 'ibo').isActive &&
      checkSubscription(user, 'ibo').restDays <= 5
    ) {
      const title = `Su membresía de tipo IBO está por vencer. ${
        checkSubscription(user, 'ibo').restDays
      } días restantes`
      const type =
        checkSubscription(user, 'ibo').restDays > 3 ? 'warning' : 'danger'
      createNotification(title, type, 600000)
    }
  }

  const verifyMembershipExpiration = () => {
    checkProSubscription()
    setTimeout(() => {
      checkSupremeSubscription()
    }, 1500)
    setTimeout(() => {
      checkIboSubscription()
    }, 2000)
  }

  return (
    <Loading /* loading={loading} */>
      <SocialMediaRedirection />
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img src="/img/dashboard/banner-1-empowerit-top.jpg" className="w-full" />
      </div>
      <Rank />
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img src="/img/dashboard/ServicesBanner.jpg" className="w-full" />
      </div>
      <Charts />
      {/*<Events />*/}
      <div className="grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-x-4 gap-y-4">
        <Summary />
        <Links />
      </div>

      <Dialog
        isOpen={openWelcomeModal}
        width={1000}
        closable={true}
        onClose={closeModal}
      >
        <WelcomeForm
          data={userLogged}
          setOpenWelcomeModal={setOpenWelcomeModal}
        />
      </Dialog>
    </Loading>
  )
}

export default SalesDashboardBody
