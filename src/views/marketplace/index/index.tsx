import { formatNumberWithCommas } from '@/utils/format'
import products from './products.json'
import { FaMinus, FaPlus, FaStar } from 'react-icons/fa'
import { useState } from 'react'

const Marketplace = () => {
  const [cart, setCart] = useState(
    products.map((p) => ({
      id: p.id,
      product_galleries: p.product_galleries,
      name: p.name,
      sale_price: p.sale_price,
      price: p.price,
      quantity: 0,
    }))
  )

  const setToCart = (product_id: number, quantity: number) => {
    if (quantity < 0) return
    setCart((products) => {
      const _products = [...products]
      const index = _products.findIndex((r) => r.id == product_id)
      if (index > -1) {
        _products[index].quantity = quantity
      }
      return _products
    })
  }

  const pay = async () => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/`)
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div>
      <img src="/img/empoweritup.png" className="w-[400px]" />
      <p className="text-lg italic my-4">
        Arma tu carrito y pagalo a precio preferencial
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
        {cart.map((p) => (
          <div
            key={p.id.toString()}
            className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4"
          >
            <img
              src={p.product_galleries[0].original_url}
              className="w-[80%] flex-1 object-contain"
            />
            <div className="flex justify-start w-full text-lg">
              <span className="font-bold">{p.name}</span>
            </div>
            <div className="flex justify-start w-full space-x-2">
              <span className="font-medium">
                ${formatNumberWithCommas(p.sale_price, 2, '-', false)}
              </span>
              <span className="line-through text-gray-400">
                ${formatNumberWithCommas(p.price, 2, '-', false)}
              </span>
            </div>
            <div className="flex justify-start items-center w-full py-2 space-x-2">
              <div className="flex justify-start text-yellow-500 space-x-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div>
                <span className="font-medium">En existencia</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                className="rounded-full bg-black text-white p-2 text-lg hover:bg-slate-800"
                onClick={() => setToCart(p.id, p.quantity - 1)}
              >
                <FaMinus />
              </button>
              <input
                value={p.quantity}
                className="flex-1 rounded-full text-black bg-gray-300 h-full text-center"
                disabled
              />
              <button
                className="rounded-full bg-black text-white p-2 text-lg hover:bg-slate-700"
                onClick={() => setToCart(p.id, p.quantity + 1)}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8 w-full">
        <div className='w-[300px] text-lg px-4 border-t border-gray-400'>
          <div className="w-full grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 pt-2">
            <div className="font-bold text-right"># Articulos</div>
            <div>{cart.reduce((a, b) => a + b.quantity, 0)}</div>

            <div className="font-bold text-right">Total</div>
            <div>
              $
              {formatNumberWithCommas(
                cart.reduce((a, b) => a + Number(b.sale_price) * b.quantity, 0),
                2,
                '-',
                false
              )}{' '}
              MXN
            </div>
          </div>
          <div className="w-full mt-2">
            <button className="bg-black text-white rounded-full w-full p-2" onClick={() => pay()}>
              Pagar con Litecoin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace
