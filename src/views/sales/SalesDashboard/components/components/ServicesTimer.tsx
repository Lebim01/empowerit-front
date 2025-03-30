import { useAppSelector } from '@/store'
import Card from './Card'
import useTimer from '@/hooks/useTimer'
import dayjs from 'dayjs'

const ServicesTimer = () => {
  const user = useAppSelector((state) => state.auth.user)

  if (!(user.is_mr_money_active || user.is_mr_sport_active)) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <CardService
        name="Mr Sport"
        image="/img/digital-marketplace/mr-sport-money.jpg"
        expiration={user.mr_sport_money_expires_at}
      />
      <CardService
        name="Mr Money"
        image="/img/digital-marketplace/mr-money-power.png"
        expiration={user.mr_money_power_expires_at}
      />
    </div>
  )
}

type PropsCard = {
  name: string
  image: string
  expiration: { seconds: number } | null
}

const CardService = (props: PropsCard) => {
  const timer = useTimer(
    props.expiration?.seconds
      ? dayjs(props.expiration.seconds * 1000)
          .toDate()
          .getTime()
      : 0
  )
  return (
    <Card className="rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <img
          className="rounded-full aspect-square h-20 w-20"
          src={props.image}
        />
        <div>
          <p className="font-bold text-lg">{props.name}</p>
          <span>{timer}</span>
        </div>
      </div>
    </Card>
  )
}

export default ServicesTimer
