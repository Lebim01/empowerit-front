import useCopyLink from '@/utils/hooks/useCopyLink'
import { useAppSelector } from '@/store'
import { toast, Notification } from '@/components/ui'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

const Links = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [host, setHost] = useState('')
  const { copyLink } = useCopyLink()

  const isIBOActive = user?.subscription?.ibo?.status === 'paid'

  const hasScholarship = user.scholarship?.has_scholarship ?? false
  const derrameSide = user.position

  useEffect(() => {
    setHost(window.location.host)
  }, [])

  const handleClick = (position: string) => {
    copyLink(user.uid!, position)
    toast.push(<Notification title={'Link copiado'} type="success" />, {
      placement: 'top-center',
    })
  }

  const showLeft =
    !isIBOActive || hasScholarship || (!hasScholarship && derrameSide == 'left')

  const showRight =
    !isIBOActive ||
    hasScholarship ||
    (!hasScholarship && derrameSide == 'right')

  return (
    <>
      <div className="flex flex-col bg-slate-100 p-4 rounded-[10px] h-fit w-full xl:w-[50%]">
        <h5>Links de registro</h5>
        <p>Comparte tu link para el registro de tus referidos</p>
        <div className=" border border-slate-300 p-4 mt-2  rounded-[8px] space-y-2">
          {isIBOActive ? (
            <span>
              Links autogenerados por <strong>EMPOWERIT TOP</strong>
            </span>
          ) : (
            <span>
              Activa tu membresia <strong>IBO</strong> para desbloquear
            </span>
          )}
          {showLeft && (
            <div className="flex items-center justify-between space-x-4">
              <div className=" b bg-white flex-1 p-2 rounded-[8px] w-[0%] border border-slate-300">
                <p
                  className={classNames(
                    'truncate',
                    !isIBOActive && 'blur-[2px]'
                  )}
                >
                  {host}/sign-up/{user?.uid}/{user?.left}
                </p>
              </div>
              <button
                className={classNames(
                  'p-2 rounded-[8px] border border-slate-300',
                  isIBOActive && 'hover:border-slate-600 bg-white',
                  !isIBOActive && 'bg-gray-100 text-gray-400'
                )}
                disabled={!isIBOActive}
                onClick={() => handleClick('left')}
              >
                Copiar link izq.
              </button>
            </div>
          )}
          {showRight && (
            <div className="flex items-center justify-between space-x-4">
              <div className=" b bg-white flex-1 p-2 rounded-[8px] w-[0%] border border-slate-300">
                <p
                  className={classNames(
                    'truncate',
                    !isIBOActive && 'blur-[2px]'
                  )}
                >
                  {host}/sign-up/{user?.uid}/{user?.right}
                </p>
              </div>
              <button
                className={classNames(
                  'p-2 rounded-[8px] border border-slate-300',
                  isIBOActive && 'hover:border-slate-600 bg-white',
                  !isIBOActive && 'bg-gray-100 text-gray-400'
                )}
                disabled={!isIBOActive}
                onClick={() => handleClick('right')}
              >
                Copiar link der.
              </button>
            </div>
          )}
        </div>
        {/*<span className="mt-2">
          <strong>Contáctanos</strong> para cualquier duda{' '}
        </span>*/}
      </div>
    </>
  )
}

export default Links
