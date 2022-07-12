import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { db } from '../firebase/firebase'
import { useUserAuth } from '../context/UserAuthContext'
import {TbTruckDelivery} from 'react-icons/tb'
import { alerta } from '../functions/functions'

export default function Inventory() {
  
  // Para navegar entre páginas
  const navigate = useNavigate()

  // Para tener los datos del usuario
  const{user} = useUserAuth()

  // HOOKS
  const [productos, setProductos] = useState([])
  const [ediciones, setEdiciones] = useState([])
  const [email, setEmail] = useState()
  const [fechaEdicion, setFechaEdicion] = useState()
  const [uid, setUid] = useState()


  // Función para obtener el inventario correspondiente al usuario
  const getInventario = async() => {   
    // Referencia a la tabla de usuarios
		const ref = collection(db, 'inventario')
		// Query a la referencia
		const q = query(ref, where("email", "==", user.email))
    
		const inventarioSnapshot = await getDocs(q)
    inventarioSnapshot.forEach((doc)=>{
      setProductos(doc.data().productos)
      setEdiciones(doc.data().ediciones)
      setEmail(doc.data().email)
      setFechaEdicion(doc.data().fechaEdicion)
      setUid(doc.data().uid)
    })
    Swal.close()
  }

  const sumaInventario = () => {
    let valor = 0
    for(let i=0;i<productos.length;i++){
      valor+=productos[i].quantity
    }
    return valor
  }


  useEffect(()=>{
    alerta(true, 'Buscando datos!', null, 'Obteniendo información de la nube, porfavor espere...')

		getInventario()
    
  }, [])


  return (
    <div className='w-full'>
      {user.role === 'admin' ? 
      <div className='flex justify-end'>
        <button className='flex flex-row mt-3 mr-5 bg-blue-600 py-2 px-4 text-white rounded-lg border-2 border-slate-500 hover:bg-blue-500'>
          <p>Realizar entrega</p>
          <TbTruckDelivery/>
        </button>
      </div>
      :
      <></>
      }
      <div className='bg-zinc-200 mt-6 m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
        <h1 className='text-3xl font-bold ml-3 my-3'>Inventario</h1>
        <div className='flex flex-col justify-center w-full bg-transparent overflow-x-scroll md:overflow-auto'>
          <table className='mx-3 w-full table-auto'>
            <thead className='bg-sky-700 border-2 border-slate-500 text-white'>
              <tr className='divide-x-2 divide-slate-500'>
                <th className='min-w-[110px] py-2 px-3'>Marca</th>
                <th className='min-w-[110px] py-2 px-3'>Nombre</th>
                <th className='min-w-[110px] py-2 px-3'>Puffs</th>
                <th className='min-w-[60px] py-2 px-3'>Cantidad</th>
              </tr>
            </thead>
            <tbody className='bg-slate-100 border-2 border-slate-500 divide-y-2 divide-slate-500'>
              {productos.map((product)=> (
                  <tr key={product.id} className='divide-x-2 divide-slate-500'>
                    <th className='min-w-[110px] py-2 px-3'>{product.brand}</th>
                    <th className='min-w-[110px] py-2 px-3'>{product.name}</th>
                    <th className='min-w-[110px] py-2 px-3'>{product.puffs}</th>
                    <th className='min-w-[60px] py-2 px-3'>{product.quantity}</th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <h1 className='text-3xl font-bold my-5 mr-5 text-right'>Total: {sumaInventario()}</h1>
        <div className='border-2 border-slate-500 rounded-lg'>
          <div className='flex flex-row justify-center my-3 mx-3'>
            <p className='text-2xl font-semibold'>Última modificación: </p>
            <p className='text-2xl'>  {fechaEdicion}</p>
          </div>
        </div>
        <div className='flex justify-end my-3 mr-3 text-sky-700 underline'>
          <Link to={`/ver-detalles-inventario/${uid}`}>
            <p>Ver detalles de edición</p>
          </Link>
        </div>
        
      </div>
    </div>
  )
}
