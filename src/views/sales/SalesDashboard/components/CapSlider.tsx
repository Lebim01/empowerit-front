import { useAppSelector } from "@/store"

export default function CapSlider() {

    const user = useAppSelector((state) => state.auth.user)

    if (!user || user.membership_cap_current === undefined || user.membership_cap_limit === undefined) {
        return null; // Otra opción es mostrar un mensaje de error o de carga
    }

    const currentCap = user.membership_cap_current;
    const capLimit = user.membership_cap_limit;

    const percentage = (currentCap / capLimit) * 100;

    const capBackgroundColor = percentage >= 80 ? 'bg-red-500' : 'bg-indigo-400';

    return (
        <div>
            <div className='card bg-slate-100 p-4  card-border bg-slate-100 rounded-[10px] flex flex-col '>
                <span className='mx-auto font-bold text-xl uppercase'>{user.membership}</span>
                <div className='w-full bg-white h-[30px] rounded-full my-4 mx-auto'>
                <div style={{ minWidth: '30px', width: `${percentage}%` }} className={`rounded-full h-[30px] flex text-center justify-center text-white ${capBackgroundColor}`}>
                        <span className='font-bold pt-1'>{user.membership_cap_current}</span>
                    </div>
                    <div className="justify-between flex font-bold mt-1">
                        <span className="text-left">0</span>
                        <span className="text-right">CAP {user.membership_cap_limit}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
