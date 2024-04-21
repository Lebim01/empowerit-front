import { Button, Input, Notification, Radio, Select, toast } from "@/components/ui"
import { db } from "@/configs/firebaseConfig"
import { Memberships } from "@/views/memberships/methods"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useState } from "react"

const OPTIONS = [
    {
      label: 'Pro',
      value: 'pro',
    },
    {
      label: 'Supreme',
      value: 'supreme',
    },
    {
      label: 'Alive Pack',
      value: "alive-pack"
    },
    {
      label: 'Freedom Pack',
      value: "freedom-pack"
    },
    {
      label: 'Business Pack',
      value: "business-pack"
    },
    {
      label: 'Elite Pack',
      value: 'elite-pack',
    },
    {
      label: 'Vip Pack',
      value: 'vip-pack',
    },
  ]

const ActiveWithVolume = () => {
    const [email, setEmail] = useState("")
    const [membership, setMembership] = useState<Memberships>('pro')
    const [loading, setLoading] = useState(false)

    const enter = async () => {
        setLoading(true)
        try {
        const res = await getDocs(
          query(collection(db, 'users'), where('email', '==', email))
        )
          if (!res.empty) {
            await fetch(
              `${import.meta.env.VITE_API_URL}/subscriptions/activeWithVolumen`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_id: res.docs[0].id,
                  membership,
                }),
              }
            )
            toast.push(
              <Notification title="Usuario activado!" type="success" />,
              {
                placement: 'top-center',
              }
            )
          } else {
            toast.push(
              <Notification title="Usuario no existe" type="warning" />,
              {
                placement: 'top-center',
              }
            )
          }
        }catch(err){
            console.error(err)
        }finally{
            setLoading(false)
        }
    }

    return (
      <div>
        <div className="w-full md:w-1/2 flex flex-col space-y-4 items-end">
          <Select
            className="w-full"
            options={OPTIONS}
            value={OPTIONS.find((r) => r.value == membership)}
            onChange={(e) => {
              if (e?.value) setMembership(e.value as Memberships)
              else setMembership('pro')
            }}
          />
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Button onClick={enter} loading={loading}>Activar</Button>
          </div>
        </div>
      </div>
    )
}

export default ActiveWithVolume