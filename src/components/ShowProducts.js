import React, {useState, useEffect} from 'react'
import { db } from '../firebase/firebase'
import { collection, query, orderBy, onSnapshot} from 'firebase/firestore'
import Swal from 'sweetalert2'
import {AiFillEdit} from 'react-icons/ai'
import { useUserAuth } from '../context/UserAuthContext'
import {AiOutlineFileAdd} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { alerta } from '../functions/functions'

export default function ShowProducts() {
	// Para navegar entre páginas
	const navigate = useNavigate()
	// Hook para la lista de productos
	const [products, setProducts] = useState([])
	// Datos del usuario
	const {user} = useUserAuth()

	// Use effect para renderización de los datos
  	useEffect(()=>{
		// Referencia a la tabla de usuarios
		const ref = collection(db, 'productos')
		// Query a la referencia
		const q = query(ref, orderBy('name', 'asc'))
		alerta(true, 'Buscando datos!', null, 'Obteniendo información de la nube, porfavor espere...')
		// Función unsubscribe
		const unsub = onSnapshot(q, (snapshot) => {
			setProducts(snapshot.docs.map((doc) => ({...doc.data(), id:doc.id})))
			Swal.close()
		})
		return unsub
  	}, [])
  return (
    <>
		{user.role === 'admin' ? 
			<div className='grid grid-cols-1 gap-5 mx-5 md:grid-cols-2 lg:mx-[80px]'>
				<div>
					<span></span>
				</div>
				<div className='ml-auto mr-4 bg-blue-600 px-4 py-3 text-white rounded-lg border-2 border-slate-500 hover:bg-blue-500 md:mt-5'>
					<button onClick={()=>navigate('/crear-producto')} className='flex flex-row'>
						Crear
						<AiOutlineFileAdd/>
					</button>
				</div>
				{products.map((product) => (
					<div key={product.id} className='bg-slate-900 flex flex-row rounded-2xl 
							overflow-hidden border-4 border-cyan-600 shadow-md shadow-slate-600'>
						<div className='w-[50%] bg-white flex items-center justify-center'>
							<img src={product.photo} alt={product.name}/>
						</div>
						<div className='p-3 font-semibold text-white'>
							<div className='flex flex-row justify-between'>
								<h1 className='text-lg font-bold'>{product.name}</h1>
								<Link to={`/editar-producto/${product.id}`}>
									<AiFillEdit className='cursor-pointer fill-white h-5 w-5'/>
								</Link>
								
							</div>
							<p>{product.brand}</p>
							<p>{product.puffs} puffs 💨</p>
							<p>{product.nic}% de nicotina</p>
							<hr className='my-2' />
							<p className='text-sm'>Creado en: {product.date}</p>
						</div>
						
					</div>
				))}
			</div>
		:
			<div className='grid grid-cols-1 gap-5 my-5 mx-5 md:grid-cols-2'>
				{products.map((product) => (
					<div key={product.id} className='bg-slate-900 flex flex-row rounded-2xl 
							overflow-hidden border-4 border-cyan-600 shadow-md shadow-slate-600'>
						<div className='w-[50%] bg-white flex items-center justify-center'>
							<img src={product.photo} alt={product.name}/>
						</div>
						<div className='p-3 font-semibold text-white'>
							<div className='flex flex-row justify-between'>
								<h1 className='text-lg font-bold'>{product.name}</h1>
							</div>
							<p>{product.brand}</p>
							<p>{product.puffs} puffs 💨</p>
							<p>{product.nic}% de nicotina</p>
							<hr className='my-2' />
							<p className='text-sm'>Creado en: {product.date}</p>
						</div>
						
					</div>
				))}
			</div>
		}
		</>
  )
}
