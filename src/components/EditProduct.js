import React, {useState, useEffect} from 'react'
import { db } from '../firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

export default function CreateProduct() {
	
	// HOOKS para la información del producto
	const [name, setName] = useState()
	const [brand, setBrand] = useState()
	const [puffs, setPuffs] = useState()
	const [nic, setNic] = useState()

	// Para navegar entre páginas
	const navigate = useNavigate()

	// Se obtiene el id de los parametros de la url
	const {id} = useParams()

	// Referencia a la base de datos
	const docRef = doc(db, "productos", id)

	// Se obtiene el producto por id
	const getProductById = async()=> {
		Swal.fire({
			allowOutsideClick:false,
			allowEscapeKey:false,
			allowEnterKey:false,
			timer: 1500,
			position: 'center',
			title: 'Buscando datos!',
			text:'Obteniendo información de la nube, por favor espere...',
			showConfirmButton: false,
			didOpen: ()=>{
				Swal.showLoading()
			},
		})
		

        const docSnap = await getDoc(docRef)

		if(docSnap.exists()){
			setName(docSnap.data().name)
			setBrand(docSnap.data().brand)
			setPuffs(docSnap.data().puffs)
			setNic(docSnap.data().nic)
			Swal.close()
			console.log("El producto existe")
			
		}else{
			Swal.close()
			//navigate('/productos')
			console.log('El producto no existe')
		}
        
    }

	// Función que corre al renderizar la página
	useEffect(()=>{
        getProductById(id)
        // eslint-disable-next-line
    }, [])

	// Función para crear el Producto
	const handleSubmit = async(e) => {
		e.preventDefault()
		const editDate = new Date().toLocaleString()
        const data = {
			name:name,
			brand:brand,
			puffs:puffs,
			nic:nic,
			editDate:editDate
		}

		Swal.fire({
			allowOutsideClick:false,
			allowEscapeKey:false,
			allowEnterKey:false,
			position: 'center',
			title: 'Editando Documento!',
			text:'Esperando respuesta del servidor...',
			showConfirmButton: false,
			didOpen: ()=>{
				Swal.showLoading()
			},
		})

        await updateDoc(docRef, data).then(()=>{
			Swal.close()
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'El producto se editó correctamente!',
			})
		}).catch((err)=>{
			Swal.fire({
				position:'center',
				icon:'error',
				title:'Error al editar producto!'
			})
		})
        navigate('/productos')
		
		
	}

	
  return (
    <div className='mt-7 mb-4 mx-3 py-5 flex flex-col items-center justify-center bg-sky-700 rounded-3xl border-2 border-cyan-600 shadow-md
		 shadow-black md:p-[50px] md:mx-[140px]'>
		<h1 className='text-3xl font-bold text-white'>Editar Producto</h1>

		<form onSubmit={handleSubmit} className='flex flex-col'>
			
			<label className='mt-5 text-xl font-bold text-white mb-1'>Nombre:</label>
			<input 
				onChange={(e)=>setName(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder={name} 
			/>

			<label className='text-xl font-bold text-white mb-1'>Marca:</label>
			<input 
				onChange={(e)=>setBrand(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder={brand}
			/>

			<label className='text-xl font-bold text-white mb-1'>Puffs:</label>
			<input 
				onChange={(e)=>setPuffs(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder={puffs}
			/>

			<label className='text-xl font-bold text-white mb-1'>Nicotina (%):</label>
			<input 
				onChange={(e)=>setNic(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder={nic}
			/>

			<div className='flex flex-row justify-center'>
				<button onClick={()=>navigate('/productos')} className='mt-4 bg-red-600 py-3 px-5 rounded-xl text-white font-bold hover:bg-red-500'>
					Cancelar
				</button>
				<span className='mx-3'></span>
				<button 
					id='buttonSubmit' 
					className='mt-4 bg-lime-500 py-3 px-5 rounded-xl text-white font-bold hover:bg-lime-400' 
					type='submit'
				>
					Editar
				</button>
			</div>
			
		</form>
	</div>
  )
}
