import Membership from './membership'

const PayMembership = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h3>
        <span className="bg-gradient-to-r from-blue-600 via-red-500 to-green-400 inline-block text-transparent bg-clip-text">
          EMPOWERIT UP
        </span>
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/membership/pro.PNG"
          name={'alive-pack'}
          display_name="Alive Pack"
          month_price={129}
        />
        <Membership
          image="/membership/supreme.PNG"
          name="freedom-pack"
          display_name="Freedom Pack"
          month_price={479}
        />
        <Membership
          image="/membership/supreme.PNG"
          name="business-pack"
          display_name="Business Pack"
          days_label='Trimestral'
          days={90}
          month_price={1289}
        />
      </div>

      <h3>
        <span className="bg-gradient-to-r from-green-600 to-yellow-500 inline-block text-transparent bg-clip-text">
          TOP BUSINESS
        </span>
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/membership/pro.PNG"
          name="pro"
          display_name="PRO"
          month_price={99}
          year_price={999}
        />
        <Membership
          image="/membership/supreme.PNG"
          name="supreme"
          display_name="SUPREME"
          month_price={199}
          year_price={1999}
        />
      </div>

      <h3>
        <span className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-600 inline-block text-transparent bg-clip-text">
          HEALTH AND DIGITAL BUSINESS PACKAGE
        </span>
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/membership/pro.PNG"
          name="elite-pack"
          display_name="Paquete Elite"
          month_price={228}
        />
        <Membership
          image="/membership/supreme.PNG"
          name="vip-pack"
          display_name="Paquete VIP"
          month_price={678}
        />
      </div>
    </div>
  )
}

export default PayMembership
