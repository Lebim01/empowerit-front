import SignInForm from './SignInForm'

const SignIn = () => {
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-center mb-8 md:hidden">
          <img src="/img/logo3/logo-light-full.png" className="w-[300px]" />
        </div>
        <h3 className="mb-1">¡Bienvenido!</h3>
        <p>Por favor, escribe tu correo y contraseña para iniciar sesión</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  )
}

export default SignIn
