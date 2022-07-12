import React, {useEffect, useState} from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { db } from '../firebase/firebase'
import {MdCreateNewFolder} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import {TbListDetails} from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { alerta } from '../functions/functions'

export default function Pedidos() {
  // HOOKS
  const [pedidos, setPedidos] = useState([])
  // Para navegar entre páginas
  const navigate = useNavigate()
  // Carga los pedidos cada vez que se refresca la página
  useEffect(()=>{
    // Referencia a la tabla de usuarios
		const ref = collection(db, 'pedidos')
		// Query a la referencia
		const q = query(ref, orderBy('nombre', 'desc'))

    alerta(true, 'Buscando datos!', null, 'Obteniendo información de la nube, porfavor espere...')

		// Función unsubscribe
		const unsub = onSnapshot(q, (snapshot) => {
			setPedidos(snapshot.docs.map((doc) => ({...doc.data(), id:doc.id})))
			Swal.close()
		})
    
		return unsub
  }, [])

  return (
    <div className='mx-7 md:mx-[100px]'>
      <div className='flex'>
        <button onClick={()=>navigate('/crear-pedido')} className='flex flex-row ml-auto mr-8 mt-6 bg-blue-600 px-4 py-3 text-white rounded-lg border-2 border-slate-500 hover:bg-blue-500'>
          Nuevo Pedido
          <MdCreateNewFolder className='ml-2 h-5 w-5'/>
        </button>
      </div>
      {pedidos.map((pedido) => (
        <div key={pedido.id} className='bg-zinc-200 mt-6 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600 md:px-12'>
          <h1 className='text-2xl font-bold text-center flex justify-between'>
            {pedido.nombre}
          </h1>
          <div className='w-full border-t border-gray-500 my-3'></div>
          <div>
            <p className='font-bold'>Hecho por:</p>
            <p>{pedido.hechoPor}</p>
          </div>
          <div>
            <p className='font-bold'>Procedencia:</p>
            <p>{pedido.procedencia}</p>
          </div>
          <div>
            <p className='font-bold'>Proveedor:</p>
            <p>{pedido.proveedor}</p>
          </div>
          <div>
            <p className='font-bold'>Método de envío:</p>
            <p>{pedido.metodoEnvio}</p>
          </div>
          <div>
            <p className='font-bold'>Cantidad de Vapes:</p>
            <p>{pedido.cantidadVapes}</p>
          </div>
          <div>
            <p className='font-bold'>Fecha de creación:</p>
            <p>{pedido.fechaCreacion}</p>
          </div>
          <div>
            <p className='font-bold'>Fecha estimada de llegada:</p>
            <p>{pedido.fechaEstimada}</p>
          </div>
          <div>
            <p className='font-bold'>Fecha real de llegada:</p>
            {pedido.fechaReal === 'En proceso...' ? 
            <p className='text-red-600'>{pedido.fechaReal}</p>
            :
            <p className='text-green-600'>{pedido.fechaReal}</p>
            }
          </div>
          <div>
            <p className='font-bold'>Id:</p>
            <p>{pedido.id}</p>
          </div>
          <Link to={`/ver-pedido/${pedido.id}`}>
            <div className='flex justify-end mt-5'>
              
              <button className='ml-2 flex flex-row px-4 py-3 bg-slate-700 rounded-lg hover:bg-slate-600'>
                <p className='text-white'>Ver Detalles</p>
                <TbListDetails className='w-6 h-6 bg-white fill-sky-600 ml-2'/>
              </button>
            </div>
          </Link>
          
        </div>
        ))
      }
    </div>
  )
}
