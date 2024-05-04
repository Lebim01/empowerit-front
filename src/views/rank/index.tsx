import { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'
import { IProfitsHistory } from './Rank.definition'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import { getDocs, query, collection, orderBy } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import classNames from 'classnames'
import { ranksOrder, ranksPoints, ranks_object } from './ranks_object'

const dayweeks = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
]

dayjs.extend(utc)
dayjs.extend(weekday)

const getWeeks = () => {
  const sunday_this_week = dayjs()
    .utcOffset(-6)
    .startOf('week')
    .hour(23)
    .minute(59)
  const sunday_2_weeks = sunday_this_week.subtract(1, 'week')
  const sunday_3_weeks = sunday_this_week.subtract(2, 'week')
  const sunday_4_weeks = sunday_this_week.subtract(3, 'week')
  const sunday_5_weeks = sunday_this_week.subtract(4, 'week')
  const sunday_6_weeks = sunday_this_week.subtract(5, 'week')

  const dates = [
    [sunday_6_weeks, sunday_6_weeks.add(7, 'days')],
    [sunday_5_weeks, sunday_5_weeks.add(7, 'days')],
    [sunday_4_weeks, sunday_4_weeks.add(7, 'days')],
    [sunday_3_weeks, sunday_3_weeks.add(7, 'days')],
    [sunday_2_weeks, sunday_2_weeks.add(7, 'days')],
    [sunday_this_week, sunday_this_week.add(7, 'days')],
  ]

  return {
    array: dates,
    object: {
      'actual (NA)': dates[5],
      '1ra': dates[4],
      '2da': dates[3],
      '3ra': dates[2],
      '4ta': dates[1],
      '5ta (NA)': dates[0],
    },
  }
}

const Rank = () => {
  const user: any = useAppSelector((state) => state.auth.user)
  const [rank, setRank] = useState<any>({})
  const [rankKey, setRankKey] = useState<any>({})
  const [nextRank, setNextRank] = useState<any>(null)
  const [socios, setSocios] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRank, setLoadingRank] = useState<boolean>(true)

  useEffect(() => {
    if (user.uid) {
      getRank(user.uid)
      getCurrentRank(user.rank)
    }
  }, [user.uid])

  const getCurrentRank = async (rank_key: string) => {
    setLoadingRank(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRankKey/${rank_key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_user: user.uid,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setRankKey(data)
      setLoadingRank(false)
    } catch (error) {
      setLoadingRank(false)
      return { status: 'error', error }
    }
  }

  useEffect(() => {
    if (nextRank && rank.rank) {
      const prev_rank_points =
        rank.order > 0
          ? ranksPoints[ranks_object[ranksOrder[rank.order - 1]].key]
          : null
      const options = {
        title: {
          text: 'Puntos de rango',
        },
        xAxis: {
          type: 'category',
          data: ['Izquierda', 'Derecha'],
        },
        yAxis: {
          type: 'value',
          min: rank.order > -1 ? prev_rank_points : undefined,
          max: nextRank.points * 1.2,
        },
        series: [
          {
            data: [rank.left_points, rank.right_points],
            type: 'bar',
            name: 'Puntos',
            markLine: {
              data: [
                {
                  name: nextRank.key,
                  yAxis: nextRank.points,
                  label: {
                    position: 'middle',
                    formatter: () => `${nextRank.display}`,
                    fontWeight: 'bold',
                  },
                },
              ],
            },
          },
        ],
      }
      setSocios(options)
    }
  }, [rankKey, nextRank, rank])

  useEffect(() => {
    if (rank.rank) {
      const next_rank = ranks_object[ranksOrder[rank.order + 1]]
      const next_rank_points = ranksPoints[next_rank.key]
      setNextRank({
        ...next_rank,
        points: next_rank_points,
      })
    }
  }, [rankKey])

  const getRank = async (id: string) => {
    setLoading(true)
    try {
      if (user.is_admin) {
        setRank({
          display: 'Top Legend',
          key: 'top_legend',
          next_rank: {
            display: 'Rango sin desbloquear',
            key: '?',
            order: 3,
          },
          totalUSD: {
            totalUSD: 78650,
            total_week: [25000, 18500, 19600, 15500],
          },
          user_id: user.id,
          user: user.id,
          left_week: [6, 7, 7, 5],
          right_week: [6, 8, 7, 6],
          interna: [80, 90, 89, 85],
          externa: [145, 130, 128, 160],
          firmas_directas: [12, 15, 14, 11],
        })
        setLoading(false)
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRank/${id}`,
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

  const endMonth = dayjs().endOf('month')

  return (
    <div className="flex flex-col w-full h-full space-y-10">
      <div className="flex w-full justify-between">
        <div>
          Corte: {dayweeks[endMonth.weekday()]} {endMonth.date()}{' '}
          {endMonth.format('MMMM')} 11:59 PM (CDMX)
        </div>
        <div>
          <a
            href="/img/ranks/calificacion_rangos.pdf"
            download="download"
            className="cursor-pointer underline text-blue-400 hidden"
          >
            ¿Guía de clasificación de rangos?
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Rango actual</p>
              {loadingRank ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : (
                <p className="text-[24px] font-bold">{rankKey?.display}</p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rankKey?.key}.png`}
                className={classNames(rankKey?.key == 'none' && 'hidden')}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Rango calificado para el próximo corte</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : rank.order == -1 ? (
                <p className="text-[24px] font-bold">Ninguno</p>
              ) : (
                <p className="text-[24px] font-bold">{rank.display}</p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rank?.key}.png`}
                className={classNames(
                  (rank?.key == undefined || rank?.key == 'none') && 'hidden'
                )}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Siguiente rango al que puedes llegar</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : rank.order == -1 ? (
                <p className="text-[24px] font-bold">Initial Builder</p>
              ) : (
                <p className="text-[24px] font-bold">
                  {rank?.next_rank?.display}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rank?.next_rank?.key}.png`}
                className={classNames(
                  (rank?.next_rank == undefined || rank?.next_rank == 'none') &&
                    'hidden'
                )}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>
          Pierna interna: {user?.position == 'left' ? 'Derecha' : 'Izquierda'}
        </p>
        <p>
          Pierna externa: {user?.position == 'right' ? 'Derecha' : 'Izquierda'}
        </p>
      </div>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:min-w-[500px] xl:w-[600px] xl:min-w-[600px] 2xl:w-[800px] 2xl:min-w-[800px] h-full">
          {loading ? (
            <Spinner className={`select-loading-indicatior`} size={40} />
          ) : (
            <p className="text-[24px] font-bold">
              <ReactECharts option={socios} />
            </p>
          )}
        </div>
      </div>
      <div>
        <h5>Requisitos {nextRank?.display}</h5>
        <div>
          <span>Puntos pierna más corta: {nextRank?.points} puntos</span>
          <br />
          <span>Binario activo (una persona activa de cada lado)</span>
        </div>
      </div>
    </div>
  )
}

export default Rank
