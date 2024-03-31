import { useAppSelector } from '@/store';
import { getRestDaysMembership, getRestHoursMembership } from '@/utils/membership';
import { useMemo } from 'react';
import { FaCheck, FaRegClock, FaTimes } from 'react-icons/fa';

interface MembershipInfoProps {
  type: string;
  restDays: number | null;
  restHours: number | null;
}

type MembershipType = 'pro' | 'ibo' | 'supreme' | 'starter';

const MembershipInfo = ({ type, restDays, restHours }: MembershipInfoProps) => (
  restDays !== null && restHours !== null ? (
    <div className="flex items-center mb-2 space-x-3">
      <FaRegClock />
      <span className="text-[16px] font-bold flex-1">{`Membresia ${type.toUpperCase()}`}</span>
      <span className="flex flex-col">
        <span>{restDays} días</span>
        <span>{restHours} horas</span>
      </span>
    </div>
  ) : null
);

const Summary = () => {
  const user = useAppSelector((state) => state.auth.user);

  const getMembershipInfo = (type: MembershipType): { restDays: number | null; restHours: number | null } => {
    const subscription = user.subscription?.[type];
    const restDays = getRestDaysMembership(subscription?.expires_at);
    const restHours = getRestHoursMembership(restDays, subscription?.expires_at);
  
    return { restDays, restHours };
  };

  const hasBitcoinWallet = Boolean(user.wallet_bitcoin);

  return (
    <>
      <div className="flex flex-col w-full xl:w-[40%] bg-slate-100 p-4 rounded-[10px]">
        <div className="flex justify-between items-center mb-4">
          <h5>Resumen Usuario</h5>
        </div>
        <div className="flex items-center mb-2">
          {hasBitcoinWallet ? (
            <FaCheck className="text-green-600" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
          <div className="flex flex-col ml-4">
            <span className="text-[16px] font-bold">Wallet Bitcoin</span>
            {hasBitcoinWallet ? (
              <p className="text-green-600">Capturada</p>
            ) : (
              <a href="/billing">
                <p className="text-red-500">Pendiente</p>
              </a>
            )}
          </div>
        </div>

        {(['starter', 'pro', 'supreme', 'ibo'] as MembershipType[]).map((type) => {
          const { restDays, restHours } = getMembershipInfo(type);

          if (restDays !== null && restHours !== null && restDays > 0 && restHours > 0) {
            return (
              <MembershipInfo
                key={type}
                type={type}
                restDays={restDays}
                restHours={restHours}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
  };

export default Summary;
