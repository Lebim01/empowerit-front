import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { AUTOMATIC_FRANCHISES_PRICES } from '../memberships-automatic/data/FranchisesAutomaticData'
import { AutomaticFranchises } from '../memberships/methods'

export type AutomaticFranchiseData = {
  automatic_franchise_cap_current: number
  automatic_franchise_cap_limit: number
  available_pay_date: Timestamp
  created_at: Timestamp
  starts_at: Timestamp
  type: AutomaticFranchises
  user_id: string
}

export default function MyAutomaticFranchisesModal() {
  const user = useAppSelector((state) => state.auth.user)
  const [data, setData] = useState<AutomaticFranchiseData[]>([])
  const [selectedFranchise, setSelectedFranchise] = useState<number>(0)

  useEffect(() => {
    if (user && user.uid) {
      const getAutomaticFranchisesSize = async () => {
        if (!user?.uid) return
        const automaticFranchisesRef = collection(
          db,
          `users/${user.uid}/automatic-franchises`
        )
        const q = await getDocs(
          query(automaticFranchisesRef, orderBy('created_at', 'desc'))
        )
        const automaticFranchises: AutomaticFranchiseData[] = []
        for (const qDocu of q.docs) {
          automaticFranchises.push(qDocu.data() as AutomaticFranchiseData)
        }
        setData(automaticFranchises)
      }
      getAutomaticFranchisesSize()
    }
  }, [user])

  const getDaysRemaining = (date: Date) => {
    const currentDate = new Date()
    const timeDifference = date.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return `${daysRemaining} días`
  }

  return (
    <div className="-ml-8 -mt-6">
      <div>
        {data &&
          data.map((franchise, index) => (
            <Button
              key={index}
              disabled={selectedFranchise === index}
              className="border-t-0"
              onClick={() => setSelectedFranchise(index)}
            >
              Franquicia {index + 1}
            </Button>
          ))}
      </div>
      <div>
        {data.length > 0 && (
          <div>
            <div className="flex justify-between lg:w-2/3 p-4">
              <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px] min-w-[300px] rounded-[10px] h-full card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg">
                <p className="text-lg">Mi franquicia Automática</p>
                <p className="text-lg">#{selectedFranchise + 1}</p>

                <span className="font-bold text-3   xl">
                  ${' '}
                  {AUTOMATIC_FRANCHISES_PRICES[data[selectedFranchise]?.type] ??
                    'N/A'}
                </span>
              </div>
              <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px] min-w-[300px] rounded-[10px] h-full card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg">
                <p className="text-lg text-center">
                  Días para comenzar el <br />
                  rendimiento
                </p>
                <span className="font-bold text-3xl">
                  {data[selectedFranchise]?.starts_at?.seconds
                    ? getDaysRemaining(
                        new Date(
                          data[selectedFranchise].available_pay_date.seconds *
                            1000
                        )
                      )
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
