import Membership from './membership'

const PayMembership = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center space-x-4">
        <img
          src="/img/logo3/Logo-Empower-It-Up-Black.png"
          height={100}
          className="h-[40px] w-min"
        />
        <span>(PRODUCTOS)</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/alive-pack.png"
          name={'alive-pack'}
          display_name="Alive Pack"
          month_price={129}
        />
        <Membership
          image="/img/memberships/freedom-pack.png"
          name="freedom-pack"
          display_name="Freedom Pack"
          month_price={479}
        />
        <Membership
          image="/img/memberships/business-pack.png"
          name="business-pack"
          display_name="Business Pack"
          days_label="Trimestral"
          days={90}
          month_price={1289}
        />
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">ACCESO CON SERVICIO DIGITAL</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/pro.png"
          name="pro"
          display_name="PRO"
          month_price={99}
          year_price={999}
        />
        <Membership
          image="/img/memberships/supreme.png"
          name="supreme"
          display_name="SUPREME"
          month_price={199}
          year_price={1999}
        />
      </div>

      <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">ACCESO HÍBRIDO</span>
        <span>(PRODUCTO Y SERVICIO)</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/elite-pack.png"
          name="elite-pack"
          display_name="Paquete Elite"
          month_price={228}
        />
        <Membership
          image="/img/memberships/vip-pack.png"
          name="vip-pack"
          display_name="Paquete VIP"
          month_price={678}
        />
      </div>
    </div>
  )
}

export default PayMembership
