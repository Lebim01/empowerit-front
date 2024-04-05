import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
  signUpUrl?: string
}

type SignInFormSchema = {
  name: string
  password: string
  rememberMe: boolean
}

const validationSchema = Yup.object().shape({
  name: Yup.string().matches(
    /[a-z0-9]+@[a-z]+\.[a-z]*/,
    'Please enter a valid email'
  ),
  password: Yup.string().required('Please enter your password'),
  rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up',
  } = props

  const [message, setMessage] = useTimeOutMessage()

  const { signIn } = useAuth()

  const onSignIn = async (
    values: SignInFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const { name, password } = values
    setSubmitting(true)

    const result = await signIn({ email: name, password })

    if (result?.status === 'failed') {
      setMessage(result.message)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <>{message}</>
        </Alert>
      )}
      <Formik
        initialValues={{
          name: '',
          password: '',
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Correo"
                invalid={(errors.name && touched.name) as boolean}
                errorMessage={errors.name}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Correo"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Contraseña"
                invalid={(errors.password && touched.password) as boolean}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Contraseña"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-between mb-6">
                <Field className="mb-0" name="rememberMe" component={Checkbox}>
                  Recordarme
                </Field>
                <ActionLink to={forgotPasswordUrl}>
                  ¿Olvidaste tu contraseña?
                </ActionLink>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
              {/*<div className="mt-4 text-center">
                                <span>{`¿Aún no tienes una cuenta?`} </span>
                                <ActionLink to={signUpUrl}>Regístrate</ActionLink>
                            </div>*/}
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
