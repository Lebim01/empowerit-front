import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { useParams } from 'react-router-dom'
import { getUser } from '@/services/AuthService'
import { useEffect, useState } from 'react'
import { UserDoc } from '@/@types/auth'
import { db } from '@/configs/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Notification, toast } from '@/components/ui'

interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type SignUpFormSchema = {
  name: string
  password: string
  email: string
  email_confirm: string
  sponsor: string
  sponsor_id: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Ingresar tu nombre'),
  email: Yup.string().email('Correo invalido').required('Ingresar tu correo'),
  email_confirm: Yup.string().oneOf(
    [Yup.ref('email')],
    'Tu correo no coincide'
  ),
  password: Yup.string()
    .required('Ingresa tu contraseña')
    .min(6, 'Minimo 6 caracteres'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Tu contraseña no coincide'
  ),
})

const SignUpForm = (props: SignUpFormProps) => {
  const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
  const { uid, position } = useParams<{ uid: string; position: string }>()
  const [previousUid, setPreviousUid] = useState<string | null>(null)
  const [dataUser, setDataUser] = useState<UserDoc | undefined | null>(
    undefined
  )
  const { signUp } = useAuth()
  const [message, setMessage] = useTimeOutMessage()
  const [loading, setLoading] = useState(true)

  const [invalidLink, setInvalidLink] = useState(false)

  const onSignUp = async (
    values: SignUpFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!uid) return

    try {
      const { name, password, email } = values
      setSubmitting(true)

      const sponsorref = await getDoc(doc(db, 'users/' + uid))
      const sponsor = sponsorref.data()

      if (!sponsor) return

      const position_sponsor = sponsor.left == position ? 'left' : 'right'
      const result = await signUp({
        name,
        password,
        email,
        sponsor: sponsor.name,
        sponsor_id: uid,
        position: position_sponsor,
      })

      // Mensajes de error
      if (result?.status === 'failed') {
        switch (result.message.code) {
          case 'auth/email-already-in-use': {
            toast.push(
              <Notification
                title="El correo electrónico proporcionado ya está registrado."
                type="warning"
              />,
              {
                placement: 'top-center',
              }
            )
            break
          }

          default:
            setMessage(result.message)
        }
      }

      setSubmitting(false)
    } catch (err: any) {
      console.error(err)
      toast.push(<Notification title={err.toString()} type="success" />, {
        placement: 'top-center',
      })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (uid && uid !== previousUid) {
        try {
          const user = await getUser(uid)
          setDataUser(user)
          setPreviousUid(uid)
          setLoading(false)

          const is_active_ibo =
            user?.subscription?.ibo && user?.subscription?.ibo?.status == 'paid'

          const force_derrame = !(user?.has_scholarship ?? false)
          const derrame_position = user?.position
          let invalid_side = false

          if (force_derrame) {
            const link_position = position == user?.left ? 'left' : 'right'
            if (derrame_position != link_position) {
              invalid_side = true
            }
          }

          setInvalidLink(!is_active_ibo || invalid_side)
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetchUser()
  }, [uid])

  return (
    <>
      {loading ? (
        <span>Cargando...</span>
      ) : (
        <>
          {uid && !invalidLink ? (
            <div className={className}>
              {message && (
                <Alert showIcon className="mb-4" type="danger">
                  {message}
                </Alert>
              )}
              <Formik
                initialValues={{
                  name: '',
                  last_name: '',
                  password: '',
                  confirmPassword: '',
                  email: '',
                  email_confirm: '',
                  sponsor: dataUser?.name || '',
                  sponsor_id: uid,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  if (!disableSubmit) {
                    onSignUp(values, setSubmitting)
                  } else {
                    setSubmitting(false)
                  }
                }}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form>
                    <FormContainer>
                      <FormItem
                        label="Nombre"
                        invalid={errors.name && touched.name}
                        errorMessage={errors.name}
                      >
                        <Field
                          type="text"
                          autoComplete="off"
                          name="name"
                          placeholder="Nombre"
                          component={Input}
                        />
                      </FormItem>
                      <FormItem
                        label="Email"
                        invalid={errors.email && touched.email}
                        errorMessage={errors.email}
                      >
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          component={Input}
                        />
                      </FormItem>
                      <FormItem
                        label="Confirmar Email"
                        invalid={errors.email_confirm && touched.email_confirm}
                        errorMessage={errors.email_confirm}
                      >
                        <Field
                          disablePaste
                          type="email"
                          autoComplete="off"
                          name="email_confirm"
                          placeholder="Confirmar Email"
                          component={Input}
                        />
                      </FormItem>
                      <FormItem
                        label="Contraseña"
                        invalid={errors.password && touched.password}
                        errorMessage={errors.password}
                      >
                        <Field
                          autoComplete="off"
                          name="password"
                          placeholder="Password"
                          component={PasswordInput}
                        />
                      </FormItem>
                      <FormItem
                        label="Confirmar Contraseña"
                        invalid={
                          errors.confirmPassword && touched.confirmPassword
                        }
                        errorMessage={errors.confirmPassword}
                      >
                        <Field
                          autoComplete="off"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          component={PasswordInput}
                        />
                      </FormItem>
                      <FormItem
                        label="Patrocinador"
                        errorMessage={errors.sponsor}
                      >
                        <Field
                          autoComplete="off"
                          name="sponsor"
                          placeholder={dataUser?.name}
                          component={Input}
                          disabled={true}
                        />
                      </FormItem>
                      <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                      >
                        {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
                      </Button>
                      <div className="mt-4 text-center">
                        <span>¿Ya tienes una cuenta? </span>
                        <ActionLink to={signInUrl}>Inicia sesión</ActionLink>
                      </div>
                    </FormContainer>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <span className="text-red-500">
              Este enlace no es valido por el momento
            </span>
          )}
        </>
      )}
    </>
  )
}

export default SignUpForm
