import { useState } from 'react'
import FormPayPack from './components/FormPayPack'
import { useAppSelector } from '@/store'
import classNames from 'classnames'
import { Coins, PAYMENT_LINK_TYPE, createPackagePaymentLink } from './methods'

const PackProSupreme = () => {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const createPaymentLinkPack = async (
    type: PAYMENT_LINK_TYPE,
    currency: Coins
  ) => {
    try {
      if (loading) return

      setLoading(true)

      // Crear dirección de pago
      await createPackagePaymentLink(user.uid!, type, currency)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const is_active_supreme =
    user?.subscription?.supreme && user?.subscription?.supreme.status == 'paid'
  const is_active_pro =
    user?.subscription?.pro && user?.subscription?.pro.status == 'paid'

  return (
    <div className="flex flex-col space-y-4">
      {!is_active_pro && !is_active_supreme && <h3>Paquetes</h3>}
      {!is_active_pro && !is_active_supreme && (
        <div
          className={classNames(
            'rounded-md w-full md:w-[450px] ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
            'ring-gray-200'
          )}
        >
          <div className="relative flex justify-center">
            <img
              src="/membership/pro.PNG"
              className={classNames(
                'object-contain transition-all duration-75 w-[40%]',
                'brightness-50 contrast-50'
              )}
            />
            <img
              src="/membership/supreme.PNG"
              className={classNames(
                'object-contain transition-all duration-75 w-[40%]',
                'brightness-50 contrast-50'
              )}
            />
          </div>
          <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
            <span className="text-right">Paquete: </span>
            <span className="font-bold">PRO + SUPREME</span>

            <>
              <span className="text-right">PRO:</span>
              <span className="font-bold">
                {user.is_new ? '56' : '28'} días
              </span>
              <span className="text-right">SUPREME:</span>
              <span className="font-bold">168 días</span>
              <span className="text-right">Total:</span>
              <span className="font-bold">$ 277 USD</span>
            </>
          </div>

          <FormPayPack
            type={PAYMENT_LINK_TYPE.PRO_SUPREME}
            loading={loading}
            createPaymentLink={createPaymentLinkPack}
          />
        </div>
      )}
    </div>
  )
}

export default PackProSupreme
