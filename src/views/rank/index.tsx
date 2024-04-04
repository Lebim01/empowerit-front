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
  const [rank, setRank] = useState<any>('Sin rango')
  const [rankKey, setRankKey] = useState<any>('Sin rango')
  const [socios, setSocios] = useState<any>({})
  const [ganancias, setGanancias] = useState<any>({})
  const [firmas, setFirmas] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRank, setLoadingRank] = useState<boolean>(true)
  const [weeks] = useState(getWeeks())
  const [payrollDetails, setPayrollDetails] = useState<any[]>([])

  useEffect(() => {
    if (user.uid) {
      getRank(user.uid)
      getRankKey(user.rank)
    }
  }, [user.uid])

  const getRankKey = async (id: string) => {
    setLoadingRank(true)
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
      setRankKey(data)
      setLoadingRank(false)
    } catch (error) {
      setLoadingRank(false)
      return { status: 'error', error }
    }
  }

  useEffect(() => {
    setSocios({
      title: {
        text: 'Socios',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any, ticket: any) => {
          const week_name = params[0].name as
            | 'actual (NA)'
            | '1ra'
            | '2da'
            | '3ra'
            | '4ta'
            | '5ta (NA)'
          if (weeks.object[week_name]) {
            const week = weeks.object[week_name]
            const format_start = week[0].format('DD/MM/YY hh:mm A')
            const format_end = week[1].format('DD/MM/YY hh:mm A')
            return `
            Inicio: ${format_start} 
            <br /> 
            Fin:${format_end}
            <br/>
            <b>${params[0].value} Izquierda</b>
            <br/>
            <b>${params[1].value} Derecha</b>`
          }
          return undefined
        },
      },
      xAxis: {
        type: 'category',
        data: [
          {
            name: '5a',
            value: '5ta (NA)',
            textStyle: {
              color: 'red',
            },
          },
          '4ta',
          '3ra',
          '2da',
          '1ra',
          {
            name: 'actual',
            value: 'actual (NA)',
            textStyle: {
              color: 'red',
            },
          },
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: rank.left_week,
          type: 'bar',
          name: 'Izquierda',
        },
        {
          data: rank.right_week,
          type: 'bar',
          name: 'Derecha',
        },
      ],
    })

    setGanancias({
      title: {
        text: `Ganancias ($${
          rank.totalUSD?.total_week
            ?.reduce((a: number, b: number) => a + b, 0)
            .toFixed(2) || 0
        } USD)`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any, ticket: any) => {
          const week_name = params[0].name as
            | 'actual (NA)'
            | '1ra'
            | '2da'
            | '3ra'
            | '4ta'
            | '5ta (NA)'
          if (weeks.object[week_name]) {
            const week = weeks.object[week_name]
            const format_start = week[0].format('DD/MM/YY hh:mm A')
            const format_end = week[1].format('DD/MM/YY hh:mm A')
            return `
            Inicio: ${format_start} 
            <br /> 
            Fin:${format_end}
            <br/>
            <b>$${Math.floor(params[0].value * 100) / 100} USD</b>`
          }
          return undefined
        },
      },
      xAxis: {
        type: 'category',
        data: [
          {
            name: '5ta',
            value: '5ta (NA)',
            textStyle: {
              color: 'red',
            },
          },
          '4ta',
          '3ra',
          '2da',
          '1ra',
          {
            name: 'actual',
            value: 'actual (NA)',
            textStyle: {
              color: 'red',
            },
          },
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: rank.totalUSD?.total_week,
          type: 'bar',
          name: 'Ganancias',
        },
      ],
    })

    setFirmas({
      title: {
        text: `Firmas (${
          rank.firmas_directas?.reduce((a: number, b: number) => a + b, 0) || 0
        })`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any, ticket: any) => {
          const week_name = params[0].name as
            | 'actual (NA)'
            | '1ra'
            | '2da'
            | '3ra'
            | '4ta'
            | '5ta (NA)'
          if (weeks.object[week_name]) {
            const week = weeks.object[week_name]
            const format_start = week[0].format('DD/MM/YY hh:mm A')
            const format_end = week[1].format('DD/MM/YY hh:mm A')
            return `
            Inicio: ${format_start} 
            <br /> 
            Fin:${format_end}
            <br/>
            <b>${params[0].value} firmas</b>`
          }
          return undefined
        },
      },
      xAxis: {
        type: 'category',
        data: [
          {
            name: '5ta',
            value: '6ta (NA)',
            textStyle: {
              color: 'red',
            },
          },
          '4ta',
          '3ra',
          '2da',
          '1ra',
          {
            name: 'actual',
            value: 'actual (NA)',
            textStyle: {
              color: 'red',
            },
          },
        ],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: rank.firmas_directas,
          type: 'bar',
          name: 'Firmas',
        },
      ],
    })
  }, [rank])

  useEffect(() => {
    if (user.uid) {
      getDocs(
        query(
          collection(db, 'users/' + user.uid + '/payroll'),
          orderBy('created_at', 'desc')
        )
      ).then((snap) => {
        if (!snap.empty)
          setPayrollDetails((data) => [
            ...data,
            ...snap.docs.map((d) => d.data()),
          ])
      })
    }
  }, [user.uid])

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

  const parseFirebaseDate = (date: any, format: string) => {
    return dayjs(date.seconds * 1000 + date.nanoseconds / 1000000).format(
      format
    )
  }

  function getWeekNumber(date: dayjs.Dayjs): number {
    const firstDayOfYear = date.startOf('year')
    const pastDaysOfYear = date.diff(firstDayOfYear, 'day')
    return Math.ceil((pastDaysOfYear + firstDayOfYear.day() + 1) / 7)
  }

  const cleanGananciasMaximas = (
    rankHistory: Array<IProfitsHistory>
  ): Array<IProfitsHistory> => {
    const summedByDate = rankHistory
      ?.map((element: IProfitsHistory) => {
        const fecha = dayjs
          .unix(element.date.seconds)
          .add(element.date.nanoseconds / 1e9, 'second')
        return {
          date: parseFirebaseDate(element.date, 'DD/MM/YY'),
          total: element.total,
          week: getWeekNumber(fecha),
        }
      })
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.date === value.date && t.total === value.total
          )
      )
      .reduce<Array<IProfitsHistory>>((acc, current) => {
        const existingDate = acc.find((item) => item.week === current.week)
        if (existingDate) {
          existingDate.total += current.total
          existingDate.date.push(current.date)
        } else {
          acc.push({
            date: [current.date],
            total: current.total,
            week: current.week,
          })
        }
        return acc
      }, [])
      .map((element: IProfitsHistory) => {
        return {
          date: element.date.sort()[0],
          total: element.total,
          week: element.week,
        }
      })
    return summedByDate
  }

  const getGananciasMaximas = (rankHistory: Array<IProfitsHistory>) => {
    const profitsHistory = payrollDetails.map((payrollElement) => {
      return {
        date: payrollElement.created_at,
        total: payrollElement.total,
      }
    })
    let maxSum = 0
    let maxSumElements: any = []
    const cleanRankHistory = cleanGananciasMaximas(profitsHistory)
    const sortedData = cleanRankHistory?.sort((a, b) => a.date - b.date)

    for (let i = 0; i <= sortedData?.length - 4; i++) {
      const currentElements = sortedData.slice(i, i + 4)
      const sum = currentElements.reduce((acc, item) => acc + item.total, 0)

      if (sum > maxSum) {
        maxSum = sum
        maxSumElements = currentElements
      }
    }

    const sortedDateRange = maxSumElements?.sort(
      (a: any, b: any) => a.week - b.week
    )
    return (
      <div>
        <p className="text-[13px] font-bold">
          Ganancias Máximas 4 semanas consecutivas
        </p>
        <p className="text-[13px]">
          {`De la semana del ${sortedDateRange[0]?.date} a la semana del ${
            sortedDateRange[sortedDateRange.length - 1]?.date
          } ganaste un total de: `}
        </p>
        <p className="text-[22px] font-bold">{`$ ${maxSum.toFixed(2)} USD`}</p>
      </div>
    )
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
              ) : (
                <p className="text-[24px] font-bold">{rank.display}</p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rank?.key}.png`}
                className={classNames(rank?.key == 'none' && 'hidden')}
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
              ) : (
                <p className="text-[24px] font-bold">
                  {rank?.next_rank?.display}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              {rank?.next_rank?.key != '?' ? (
                <img
                  src={`/img/insignias/${rank?.next_rank?.key}.png`}
                  width={40}
                  height={40}
                />
              ) : (
                <img
                  src="https://cdn1.iconfinder.com/data/icons/universal-mobile-solid-icons-vol-3/48/129-512.png"
                  width={40}
                  height={40}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none hidden"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : (
                getGananciasMaximas(rank?.rankHistory)
              )}
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
      <div className="hidden flex-col-reverse lg:flex-row">
        <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:min-w-[500px] xl:w-[600px] xl:min-w-[600px] 2xl:w-[800px] 2xl:min-w-[800px] h-full">
          {loading ? (
            <Spinner className={`select-loading-indicatior`} size={40} />
          ) : (
            <p className="text-[24px] font-bold">
              <ReactECharts option={socios} />
            </p>
          )}
          {loading ? (
            <Spinner className={`select-loading-indicatior`} size={40} />
          ) : (
            <p className="text-[24px] font-bold">
              <ReactECharts option={ganancias} />
            </p>
          )}
          {loading ? (
            <Spinner className={`select-loading-indicatior`} size={40} />
          ) : (
            <p className="text-[24px] font-bold">
              <ReactECharts option={firmas} />
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rank
