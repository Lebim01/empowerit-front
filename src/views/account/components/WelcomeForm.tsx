import {
    Input,
    Button,
    Notification,
    toast,
    FormContainer,
    Select,
  } from '@/components/ui'
  import FormDescription from './FormDescription'
  import FormRow from './FormRow'
  import { Field, Form, Formik } from 'formik'
  import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineCalendar,
    HiUsers,
  } from 'react-icons/hi'
  import * as Yup from 'yup'
  import { updateUser, updateEmail_Auth } from '@/services/AuthService'
  import { setUser, useAppDispatch } from '@/store'
  import { v4 as uuidv4 } from 'uuid'
  import { useState, useEffect, useRef } from 'react'
  import { BsDiscord, BsInstagram, BsTelegram, BsTelephoneFill, BsWhatsapp } from 'react-icons/bs'
  import {
    Country,
    State,
    City,
    ILocationValues,
    ISelectOPT,
  } from '@/@types/profile'
  import useCountries, { CountriesHook } from '@/hooks/useCountries'
  import useStates, { StatesHook } from '@/hooks/useStates'
  import useCities, { CitiesHook } from '@/hooks/useCities'
  
  const WelcomeForm = ({ data, setOpenWelcomeModal }: any) => {
    const _id = useRef(uuidv4())
    const dispatch = useAppDispatch();
    const emptySelectValue: ISelectOPT = {
      label: '',
      value: '',
    }
    const [vCountry, setVCountry] = useState<Country | null>(null)
    const [vState, setVState] = useState<State | null>(null)
    const [vCity, setVCity] = useState<City | null>(null)
    const countries: CountriesHook = useCountries()
    const states: StatesHook = useStates(vCountry ?? emptySelectValue)
    const cities: CitiesHook = useCities(vState ?? emptySelectValue)
  
    const onFormSubmit = (values: any, setSubmitting: any) => {
      toast.push(<Notification title={'Perfil actualizado'} type="success" />, {
        placement: 'top-center',
      })
      setSubmitting(false);
      setOpenWelcomeModal(false);
    }
  
    const getLocationValues = (data: ILocationValues) => {
      if (data?.country?.value && !vCountry) {
        setVCountry(data.country)
      }
      if (data?.state?.value && !vState) {
        setVState(data.state)
      }
      if (data?.city?.value && !vCity) {
        setVCity(data.city)
      }
    }
  
    useEffect(() => {
      getLocationValues(data)
    }, [data])

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('User Name Required'),
      birthdate: Yup.date().required('Date Required'),
      email: Yup.string().email('Invalid email').required('Email Required'),
      country: Yup.object().shape({
        value: Yup.string().required('Country is required'),
      }),
      state: Yup.object().shape({
        value: Yup.string().required('State is required'),
      }),
      city: Yup.object().shape({
        value: Yup.string().required('City is required'),
      }),
      // discord: Yup.string().required('Discord Required'),
      // whatsapp: Yup.string().required('WhatsApp Required'),
      title: Yup.string(),
      lang: Yup.string(),
      timeZone: Yup.string(),
      syncData: Yup.bool(),
      nombreBeneficiario1: Yup.string().matches(
        /^[A-Za-z\s]+$/,
        'Este campo solo acepta letras'
      ),
      telefonoBeneficiario1: Yup.string().matches(
        /^[0-9]+$/,
        'Este campo solo acepta números'
      ),
      parentescoBeneficiario1: Yup.string().matches(
        /^[A-Za-z\s]+$/,
        'Este campo solo acepta letras'
      ),
      nombreBeneficiario2: Yup.string().matches(
        /^[A-Za-z\s]+$/,
        'Este campo solo acepta letras'
      ),
      telefonoBeneficiario2: Yup.string().matches(
        /^[0-9]+$/,
        'Este campo solo acepta números'
      ),
      parentescoBeneficiario2: Yup.string().matches(
        /^[A-Za-z\s]+$/,
        'Este campo solo acepta letras'
      ),
    })

    return (
            <Formik
              initialValues={{ ...data }}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                try {
                  const {
                    name,
                    birthdate,
                    whatsapp,
                    telegram,
                    instagram,
                    discord,
                    email,
                    nombreBeneficiario1,
                    telefonoBeneficiario1,
                    parentescoBeneficiario1,
                    nombreBeneficiario2,
                    telefonoBeneficiario2,
                    parentescoBeneficiario2
                  } = values
                  
                  const infLocation = {
                    country: vCountry,
                    state: vState,
                    city: vCity
                  }

                  const infBirthdate = {
                    birthdate: birthdate || '',
                  }
                  const infContact = {
                    name: name.trim() || '',
                    whatsapp: whatsapp || '',
                    telegram: telegram || '',
                    instagram: instagram?.trim() || '',
                    discord: discord?.toLowerCase().trim() || '',
                  }

                  const infBeneficiario = {
                    beneficiario1: {
                      nombre: nombreBeneficiario1?.trim() || '',
                      telefono: telefonoBeneficiario1 || '',
                      parentesco: parentescoBeneficiario1?.trim() || ''
                    },
                    beneficiario2: {
                      nombre: nombreBeneficiario2?.trim() || '',
                      telefono: telefonoBeneficiario2 || '',
                      parentesco: parentescoBeneficiario2?.trim() || ''
                    }
                  }

                  const sendData = {
                    ...infBirthdate,
                    ...infContact,
                    ...infBeneficiario,
                    ...infLocation,
                    email: email?.trim(),
                  }

                  if (email?.trim() != data.email) {
                    await updateEmail_Auth(email?.trim())
                  }

                  await updateUser(values.uid, sendData)
                  dispatch(
                    setUser({
                      ...values
                    })
                  )
                  setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                  }, 1000)
                } catch (e) {
                  console.log(e)
                  toast.push(
                    <Notification title={'Ha ocurrido un error'} type="danger" />,
                    {
                      placement: 'top-center',
                    }
                  )
                }
              }}
            >
                {(formProps) => {
                    const {values, touched, errors, isSubmitting, setFieldValue} = formProps;
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                          <FormDescription
                              title="¡Felicidades por formar parte de la compañía que esta revolucionando la forma de hacer negocios!"
                              desc="Completa los siguientes datos para poder disfrutar al máximo de Empowerit TOP"
                          />
                          <FormContainer >
                          <FormRow name="name" label="Nombre" {...validatorProps}>
                            <Field
                              type="text"
                              autoComplete="off"
                              name="name"
                              placeholder="Nombre"
                              component={Input}
                              prefix={<HiOutlineUserCircle className="text-xl" />}
                            />
                          </FormRow>

                          <FormRow
                            name="birthdate"
                            label="Fecha de nacimiento"
                            {...validatorProps}
                          >
                            <Field
                              type="date"
                              autoComplete="off"
                              name="birthdate"
                              placeholder="Fecha de nacimiento"
                              component={Input}
                              prefix={<HiOutlineCalendar className="text-xl" />}
                            />
                          </FormRow>
                          <FormRow name="location" label="Locación" {...validatorProps}>
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              name="country"
                              placeholder="País"
                              component={Select}
                              value={vCountry}
                              options={countries[0]}
                              onChange={(e: Country) => {
                                setVCountry(e)
                                setFieldValue("country", e);
                                setVState(null)
                                setFieldValue("state", null);
                                setVCity(null)
                                setFieldValue("city", null);
                              }}
                            />
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              name="state"
                              placeholder="Estado"
                              options={states[0]}
                              value={vState}
                              component={Select}
                              onChange={(e: State) => {
                                setVState(e)
                                setFieldValue("state", e);
                                setVCity(null)
                                setFieldValue("city", null);
                              }}
                            />
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              name="city"
                              placeholder="Ciudad"
                              component={Select}
                              options={cities[0]}
                              value={vCity}
                              onChange={(e: City) => {
                                setVCity(e)
                                setFieldValue("city", e);
                              }}
                            />
                          </FormRow>
                          <FormRow name="contact" label="Contacto" {...validatorProps}>
                            <Field
                              type="number"
                              autoComplete="off"
                              name="whatsapp"
                              placeholder="WhatsApp"
                              component={Input}
                              prefix={<BsWhatsapp className="text-xl" />}
                            />
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              type="text"
                              autoComplete="off"
                              name="instagram"
                              placeholder="Instagram"
                              component={Input}
                              prefix={<BsInstagram className="text-xl" />}
                            />
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              type="text"
                              autoComplete="off"
                              name="discord"
                              placeholder="Discord"
                              component={Input}
                              prefix={<BsDiscord className="text-xl" />}
                            />
                            <Field
                              className="mt-2 ltr:mr-2 rtl:ml-2"
                              type="number"
                              autoComplete="off"
                              name="telegram"
                              placeholder="Telegram"
                              component={Input}
                              prefix={<BsTelegram className="text-xl" />}
                            />
                          </FormRow>
                          <FormRow name="email" label="Email" {...validatorProps}>
                            <Field
                              type="email"
                              autoComplete="off"
                              name="email"
                              placeholder="Email"
                              component={Input}
                              prefix={<HiOutlineMail className="text-xl" />}
                            />
                            </FormRow>
                            
                            <FormRow
                                name="beneficiarios"
                                label="Datos de beneficiarios"
                                {...validatorProps}
                            >
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="nombreBeneficiario1"
                                    placeholder="Nombre del beneficiario #1"
                                    component={Input}
                                    prefix={<HiOutlineUserCircle className="text-xl" />}
                                />
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="telefonoBeneficiario1"
                                    placeholder="Teléfono del beneficiario #1"
                                    component={Input}
                                    prefix={<BsTelephoneFill className="text-xl" />}
                                />
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="parentescoBeneficiario1"
                                    placeholder="Parentesco"
                                    component={Input}
                                    prefix={<HiUsers className="text-xl" />}
                                />
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="nombreBeneficiario2"
                                    placeholder="Nombre del beneficiario #2"
                                    component={Input}
                                    prefix={<HiOutlineUserCircle className="text-xl" />}
                                />
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="telefonoBeneficiario2"
                                    placeholder="Teléfono del beneficiario #2"
                                    component={Input}
                                    prefix={<BsTelephoneFill className="text-xl" />}
                                />
                                <Field
                                    className="mt-2 ltr:mr-2 rtl:ml-2"
                                    type="text"
                                    autoComplete="off"
                                    name="parentescoBeneficiario2"
                                    placeholder="Parentesco"
                                    component={Input}
                                    prefix={<HiUsers className="text-xl" />}
                                />
                            </FormRow>
                            <div className="mt-4 ltr:text-right">
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    Actualizar
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                    )
                }}
            </Formik> 
        
    )
    
}

export default WelcomeForm;