import React, {useState, useEffect} from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useNavigate, useParams } from 'react-router-dom'


export default function VerDetallesInventario() {

	// Para navegar entre páginas 
	const navigate = useNavigate()

	// HOOKS
	const [ediciones, setEdiciones] = useState([])

	// Id del inventario
	const{id} = useParams()


	// Use effect para obtener el inventario
	useEffect(() => {
		// Referencia a la base de datos de inventario
		const refInventario = doc(db, "inventario", id)

		const getInventario = async()=>{
			await getDoc(refInventario).then((doc)=>{
				setEdiciones(doc.data().ediciones)
			})
		}
		getInventario()
	}, [])
	



  return (
    <div className='w-full'>
			<button 
				className='bg-blue-600 text-white py-2 px-4 ml-5 mt-5 rounded-lg border-2 border-slate-500 hover:bg-blue-500'
				onClick={()=>navigate('/inventario')}
			>
				Volver
			</button>
			<div className='bg-zinc-200 mt-6 mb-[110px] m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
				<div className='flex flex-col justify-center w-full bg-transparent'>
					<h1 className='text-3xl font-bold mb-6'>Detalles de edición</h1>
					{
						ediciones.map((edicion)=>(
							<div key={edicion.fechaEdicion} className='flex flex-col justify-center w-full bg-transparent overflow-x-scroll md:overflow-auto'>
								<h1 className='ml-3 font-semibold text-xl'>Fecha: {edicion.fechaEdicion}</h1>
								<p className='ml-3 font-semibold'>Se añadieron:</p>
								<table className='mx-3 w-full table-auto'>
									<thead className='bg-sky-700 border-2 border-slate-500 text-white'>
										<tr className='divide-x-2 divide-slate-500'>
											<th className='min-w-[110px] py-2 px-3'>Marca</th>
											<th className='min-w-[110px] py-2 px-3'>Nombre</th>
											<th className='min-w-[110px] py-2 px-3'>Puffs</th>
											<th className='min-w-[110px] py-2 px-3'>Cantidad</th>
										</tr>
									</thead>
									<tbody className='bg-slate-100 border-2 border-slate-500 divide-y-2 divide-slate-500'>
										{edicion.productos.map((product)=> (
											<tr key={product.id} className='divide-x-2 divide-slate-500'>
												<th className='min-w-[110px] py-2 px-3'>{product.brand}</th>
												<th className='min-w-[110px] py-2 px-3'>{product.name}</th>
												<th className='min-w-[110px] py-2 px-3'>{product.puffs}</th>
												<th className='min-w-[190px] py-2 px-3'>{product.quantity}</th>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						))
					}
				</div>
			</div>
		</div>
  )
}
