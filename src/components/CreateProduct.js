import React, {useState} from 'react'
import { db, storage } from '../firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
	// Referencia a la base de datos:
	const refDb = collection(db, "productos")
	// HOOKS para la información del producto
	const [name, setName] = useState()
	const [brand, setBrand] = useState()
	const [puffs, setPuffs] = useState()
	const [nic, setNic] = useState()
	const [file, setFile] = useState()

	// Para navegar entre páginas
	const navigate = useNavigate()

	// Función para cargar archivo
	const handleFile = async(e) => {
		e.preventDefault()
		const archivo = await e.target.files[0]
		setFile(archivo)
		console.log(archivo)
	}

	// Función para crear el Producto
	const handleSubmit = async(e) => {
		e.preventDefault()
		if(name && brand && puffs && nic && file){
			// Timestamp de la creación del producto
			const date = new Date().toLocaleString()
			// Subir el archivo a cloud storage
			const storageRef = ref(storage,`images/${file.name}`)

			Swal.fire({
				position: 'center',
				title: 'Procesando información!',
				text:'El producto está siendo creado, por favor espere...',
				showConfirmButton: false,
				allowEnterKey:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				didOpen: ()=>{
					Swal.showLoading()
				},
			})

			await uploadBytes(storageRef, file).then(async()=>{
				await getDownloadURL(storageRef).then((url)=>{
					console.log("Url del archivo",url)
					addDoc(refDb, {
						name:name,
						brand:brand,
						puffs:puffs,
						nic:nic,
						date:date,
						photo:url,
					}).then(()=>{
						Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'El producto se creó correctamente!',
						})
					}).catch((err)=>{
						console.log("Error al crear un producto", err)
					})
					
				}).catch((err)=>{
					console.log("Error obteniendo url:", err)
				})
			})
			
			e.target.reset()
			navigate('/productos')
			
		
			
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: 'Se deben llenar todos los espacios!',
			})
		}
		
		
	}

	
  return (
    <div className='mt-7 mb-4 mx-3 py-5 flex flex-col items-center justify-center bg-sky-700 rounded-3xl border-2 border-cyan-600 shadow-md
		 shadow-black md:p-[50px] md:mx-[140px]'>
		<h1 className='text-3xl font-bold text-white'>Crear Nuevo Producto</h1>

		<form onSubmit={handleSubmit} className='flex flex-col'>
			
			<label className='mt-5 text-xl font-bold text-white mb-1'>Nombre:</label>
			<input 
				onChange={(e)=>setName(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder='Nombre del Producto' 
			/>

			<label className='text-xl font-bold text-white mb-1'>Marca:</label>
			<input 
				onChange={(e)=>setBrand(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder='Marca del producto' 
			/>

			<label className='text-xl font-bold text-white mb-1'>Puffs:</label>
			<input 
				onChange={(e)=>setPuffs(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder='Cantidad de puffs' 
			/>

			<label className='text-xl font-bold text-white mb-1'>Nicotina (%):</label>
			<input 
				onChange={(e)=>setNic(e.target.value)} 
				className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
				type="text" 
				placeholder='Porcentaje de nicotina' 
			/>

			<label className="text-xl font-bold text-white mb-1">Imagen:</label>
			<input className="w-[250px] py-2 px-2 bg-slate-900 border-2 border-slate-400 rounded-lg text-white cursor-pointer " 
				type="file"
				accept='image/*'
				onChange={handleFile}
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
					Crear
				</button>
			</div>
			
		</form>
	</div>
  )
}
