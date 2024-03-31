import { BsTrophy } from 'react-icons/bs'
import {
  onSnapshot,
  doc,
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { FaPeopleArrows } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Dialog, Spinner } from '@/components/ui'
import dayjs from 'dayjs'
import useUserModalStore from '@/zustand/userModal'

const bonus = {
  direct: [
    'bond_direct_level_1',
    'bond_direct_level_2',
    'bond_direct_starter_level_1',
  ],
  residual: ['bond_residual_level_1', 'bond_residual_level_2'],
  supreme: [
    'bond_supreme_level_1',
    'bond_supreme_level_2',
    'bond_supreme_level_3',
  ],
  scholarship: [
    'bond_scholarship_level_1',
    'bond_scholarship_level_2',
    'bond_scholarship_level_3',
  ],
  toprice_xpert: ['bond_toprice_xpert_level_1', 'bond_toprice_xpert_level_2'],
  crypto_elite: ['bond_crypto_elite_level_1', 'bond_crypto_elite_level_2'],
}

const Rank = () => {
  const userModal = useUserModalStore((state) => state)
  const [data, setData] = useState<any>({})
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [rank, setRank] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastPayroll, setLastPayroll] = useState<any>(null)

  const [payrollDetails, setPayrollDetails] = useState<any[]>([])
  const [binaryPoints, setBinaryPoints] = useState<any[]>([])
  const [modalDetails, setModalDetails] = useState<any[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalBinary, setIsOpenModalBinary] = useState(false)
  const [isTopDollarsDisplayed, setIsTopDollarsDisplayed] = useState(false)
  useEffect(() => {
    if (user.uid) {
      const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        setData(snap.data())
      })
      return () => {
        unsub1()
      }
    }
  }, [user.uid])

  useEffect(() => {
    displayTopDollars();
  }, [data])

  useEffect(() => {
    if (typeof user.max_rank == 'string') {
      getRank(user.max_rank)
    } else if (user.max_rank?.key) {
      getRank(user.max_rank?.key)
    } else {
      getRank('vanguard')
    }
  }, [user.max_rank])

  useEffect(() => {
    if (user.uid) {
      if (user.uid != '7iRezG7E6vRq7OQywQN3WawSa872') {
        getDocs(collection(db, 'users/' + user.uid, '/left-points')).then(
          (snap) => {
            setBinaryPoints((data) => [
              ...data,
              ...snap.docs.map((r) => ({ side: 'left', ...r.data() })),
            ])
          }
        )
      }
      getDocs(collection(db, 'users/' + user.uid, '/right-points')).then(
        (snap) => {
          setBinaryPoints((data) => [
            ...data,
            ...snap.docs.map((r) => ({ side: 'right', ...r.data() })),
          ])
        }
      )
    }
  }, [user.uid])

  useEffect(() => {
    if (user.uid) {
      getDocs(
        query(
          collection(db, 'users/' + user.uid + '/payroll'),
          orderBy('created_at', 'desc'),
          limit(1)
        )
      ).then((snap) => {
        if (!snap.empty) setLastPayroll(snap.docs[0].data())
      })
    }
  }, [user.uid])

  useEffect(() => {
    if (lastPayroll) {
      getDocs(
        query(
          collection(db, 'users/' + user.uid + '/profits_details'),
          where(
            'created_at',
            '>=',
            dayjs(lastPayroll.created_at.seconds * 1000).toDate()
          ),
          orderBy('created_at', 'asc')
        )
      ).then((snap) => {
        setPayrollDetails((data) => [
          ...data,
          ...snap.docs.map((d) => d.data()),
        ])
      })
    }
  }, [lastPayroll])

  const getRank = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRankKey/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setRank(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      return { status: 'error', error }
    }
  }

  const displayTopDollars = () => {
    const userCreatedAt = data.created_at?.toDate()
    const validTopDollarsDate = new Date('2023-12-05T00:00:00');
    setIsTopDollarsDisplayed(userCreatedAt >= validTopDollarsDate);
  }

  const openDetails = (
    type:
      | 'direct'
      | 'residual'
      | 'supreme'
      | 'scholarship'
      | 'crypto_elite'
      | 'toprice_xpert'
  ) => {
    setModalDetails(payrollDetails.filter((r) => bonus[type].includes(r.type)))
    setIsOpenModal(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
          onClick={() => navigate('/rank')}
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col ">
              <p>Rango Máximo Alcanzado</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : (
                <p className="text-[24px] font-bold">{rank?.display || ''}</p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              {rank?.key ? (
                <img
                  src={`/img/insignias/${rank?.key}.png`}
                  width={40}
                  height={40}
                />
              ) : (
                <BsTrophy />
              )}
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Ganancias obtenidas</p>
              <p className="text-[24px] font-bold">
                ${data?.profits?.toFixed(2) || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsTrophy />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Miembros Directos</p>
              <p className="text-[24px] font-bold">
                {data?.count_direct_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Miembros organización</p>
              <p className="text-[24px] font-bold">
                {data?.count_underline_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        <Card onClick={() => openDetails('direct')}>
          <span className="text-lg font-medium">Bonos Directos</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2">
            <span className="font-bold text-right">
              $ {data?.bond_direct} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_direct_second_level} USD
            </span>
            <span>(segundo nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_direct_starter_level_1} USD
            </span>
            <span>(starter primer nivel)</span>
          </div>
        </Card>

        <Card onClick={() => openDetails('residual')}>
          <span className="text-lg font-medium">Bonos Residuales</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-4">
            <span className="font-bold text-right">
              $ {data?.bond_residual_level_1} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_residual_level_2} USD
            </span>
            <span>(segundo nivel)</span>
          </div>
        </Card>

        <Card onClick={() => openDetails('supreme')}>
          <span className="text-lg font-medium">Bonos Supreme</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-4">
            <span className="font-bold text-right">
              $ {data?.bond_supreme_level_1} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_supreme_level_2} USD
            </span>
            <span>(segundo nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_supreme_level_3} USD
            </span>
            <span>(tercer nivel)</span>

            <span className="font-bold text-right">
              #{(data.supreme_sequence || 0) + 1}
            </span>
            <span>Siguiente bono</span>
          </div>
        </Card>

        <Card onClick={() => openDetails('scholarship')}>
          <span className="text-lg font-medium">Bonos Beca</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-4">
            <span className="font-bold text-right">
              $ {data?.bond_scholarship_level_1} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_scholarship_level_2} USD
            </span>
            <span>(segundo nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_scholarship_level_3} USD
            </span>
            <span>(tercer nivel)</span>
          </div>
        </Card>

        <Card onClick={() => setIsOpenModalBinary(true)}>
          <span className="text-lg font-medium">Bono Binario</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-4">
            <span className="font-bold text-right">
              {data?.left_points} pts
            </span>
            <span>(izquierda)</span>

            <span className="font-bold text-right">
              {data?.right_points} pts
            </span>
            <span>(derecha)</span>

            <span className="font-bold text-right">
              {((rank?.binary || 0) * 100).toFixed(0)} %
            </span>
            <span></span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        <Card onClick={() => openDetails('crypto_elite')}>
          <span className="text-lg font-medium">Crypto Elite X</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2">
            <span className="font-bold text-right">
              $ {data?.bond_crypto_elite_level_1 || 0} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_crypto_elite_level_2 || 0} USD
            </span>
            <span>(segundo nivel)</span>
          </div>
        </Card>

        <Card onClick={() => openDetails('toprice_xpert')}>
          <span className="text-lg font-medium">Toprice Xpert</span>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2">
            <span className="font-bold text-right">
              $ {data?.bond_toprice_xpert_level_1 || 0} USD
            </span>
            <span>(primer nivel)</span>

            <span className="font-bold text-right">
              $ {data?.bond_toprice_xpert_level_2 || 0} USD
            </span>
            <span>(segundo nivel)</span>
          </div>
        </Card>
        {isTopDollarsDisplayed &&
          <Card>
            <span className="text-lg font-medium">Top Dollars</span>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2">
              <span className="font-bold text-right">
                177 Top Dollars
              </span>
            </div>
          </Card>
        }
          
        
      </div>

      <Dialog
        isOpen={isOpenModal}
        width={700}
        onClose={() => setIsOpenModal(false)}
      >
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Concepto</th>
                <th className="text-left">Usuario</th>
                <th className="text-right">USD</th>
                <th className="text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {modalDetails.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.description}</td>
                  <td>
                    <span
                      className="text-blue-500 underline hover:cursor-pointer"
                      onClick={() => userModal.openModal(r.id_user)}
                    >
                      {r.user_name}
                    </span>
                  </td>
                  <td className="text-right">{r.amount}</td>
                  <td className="text-right">
                    {r.created_at.seconds
                      ? dayjs(r.created_at.seconds * 1000).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : null}
                  </td>
                </tr>
              ))}
              {modalDetails.length == 0 && (
                <tr>
                  <td colSpan={4} className="text-left">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Dialog>

      <Dialog
        isOpen={isOpenModalBinary}
        width={700}
        onClose={() => setIsOpenModalBinary(false)}
      >
        <div className="p-4 max-h-[50vh] overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Usuario</th>
                <th className="text-left">Lado</th>
                <th className="text-right">Puntos</th>
                <th className="text-right">Expiran</th>
              </tr>
            </thead>
            <tbody>
              {binaryPoints.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <span
                      className="text-blue-500 underline hover:cursor-pointer"
                      onClick={() => {
                        userModal.openModal(r.user_id)
                        setIsOpenModalBinary(false)
                      }}
                    >
                      {r.name}
                    </span>
                  </td>
                  <td>{r.side}</td>
                  <td className="text-right">{r.points}</td>
                  <td className="text-right">
                    {r.expires_at.seconds
                      ? dayjs(r.expires_at.seconds * 1000).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : null}
                  </td>
                </tr>
              ))}
              {binaryPoints.length == 0 && (
                <tr>
                  <td colSpan={4} className="text-left">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  )
}

const Card = ({ children, onClick }: any) => {
  return (
    <div
      className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Rank
