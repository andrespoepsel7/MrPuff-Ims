import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/firebase'
import { collection, query, onSnapshot, orderBy, addDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'


export default function CrearPedido() {
    // Para navegar entre páginas
    const navigate = useNavigate()

    // HOOKS
    const [nombre, setNombre] = useState()
    const [hechoPor, setHechoPor] = useState()
    const [procedencia, setProcedencia] = useState()
    const [proveedor, setProveedor] = useState()
    const [metodoEnvio, setMetodoEnvio] = useState()
    const [fechaEstimada, setFechaEstimada] = useState()
    const [suma, setSuma] = useState(0)
    // Data que se escribirá en la base de datos
    const data = {
        nombre:nombre,
        hechoPor:hechoPor,
        procedencia:procedencia,
        proveedor:proveedor,
        metodoEnvio:metodoEnvio,
        fechaEstimada:fechaEstimada,
        cantidadVapes:suma,
    }
    // Productos para la tabla
    const [products, setProducts] = useState([])
    // Arreglo auxiliar para solo contener productos que tienen valor diferente de 0
    const [productsAux, setProductsAux] = useState([])

    // Función para subir los datos a la nube
    const handleSubmit=async()=>{
        // Fecha de creación 
        const date = new Date().toLocaleString()
        // Referencia a la base de datos de pedidos
        const refDb = collection(db, "pedidos")

        // Datos para subir a la bae de datos
        const dataToSumit = {
            nombre:data.nombre,
            hechoPor:data.hechoPor,
            cantidadVapes:data.cantidadVapes,
            procedencia:data.procedencia,
            proveedor:data.proveedor,
            metodoEnvio:data.metodoEnvio,
            fechaEstimada:data.fechaEstimada,
            fechaCreacion:date,
            fechaReal:"En proceso...",
            products:productsAux,
        }
        // Alerta que dice que se está creando el pedido
        Swal.fire({
            position: 'center',
            title: 'Procesando información!',
            text:'El pedido está siendo creado, por favor espere...',
            showConfirmButton: false,
            allowEnterKey:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen: ()=>{
                Swal.showLoading()
            },
        })

        await addDoc(refDb, dataToSumit).then(()=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El producto se creó correctamente!',
            })
        }).catch((err)=>{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Hubo un error, vuelva a intentar...',
                text:`${err.message}`
            })
        })
        navigate('/pedidos')

    }
        // Faltan fecha de creación y fecha real de llegada

    // Función para editar la cantidad que se elige de cada producto
    const handleEdit = (id, name, brand, puffs, nic, value) => {
        if(value >= 0){
            const dataProduct = {
                id:id,
                name:name,
                brand:brand,
                puffs:puffs,
                nic:nic,
                quantity:parseInt(value)
            }
            if(productsAux.length === 0){
                productsAux.push(dataProduct)
            }else{
                let coincide = false
                // Se ve si el producto ya forma parte del arreglo
                for(let i = 0;i<productsAux.length;i++){
                    if(productsAux[i].name === name){
                        // No se llenan datos
                        console.log("Coincide!")
                        coincide = true
                        console.log(coincide)
                        productsAux[i].quantity = parseInt(value)
                    }
                    
                }
                // Si no coincidió con ningún elemento se lo añade a la lista
                if(coincide === false){
                    console.log(coincide)
                    productsAux.push(dataProduct)
                }
                
            }
            
        }
        const sumaTodos = productsAux.map(item=>parseInt(item.quantity)).reduce((prev, curr)=>prev+curr, 0)
        console.log(sumaTodos)
        setSuma(sumaTodos)
    }

    // Carga los pedidos cada vez que se refresca la página
    useEffect(()=>{
        setProductsAux([])
        // Referencia a la tabla de usuarios
		const ref = collection(db, 'productos')
		// Query a la referencia
		const q = query(ref, orderBy('name', 'asc'))

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

		// Función unsubscribe
		const unsub = onSnapshot(q, (snapshot) => {
			setProducts(snapshot.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log(products)
			Swal.close()
		})
    
		return unsub
    }, [])

  return (
    <div>
        <h1 className='mt-5 text-5xl font-bold text-white text-center'>Crear Nuevo Pedido</h1>
        
        <p className='text-center mt-8 text-2xl font-bold text-white'>Paso 1 (Llenar datos):</p>

        <div className='mt-4 mb-4 mx-3 py-6 flex flex-col items-center justify-center bg-sky-700 rounded-3xl border-2 border-cyan-600 shadow-md
            shadow-black'>

            <form className='flex flex-col'>
                
                <label className='mt-5 text-xl font-bold text-white mb-1'>Nombre del pedido:</label>
                <input 
                    onChange={(e)=>setNombre(e.target.value)} 
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="text" 
                    placeholder='Ej. numPedido/12/Enero/2022' 
                />

                <label className='text-xl font-bold text-white mb-1'>Hecho por:</label>
                <input 
                    onChange={(e)=>setHechoPor(e.target.value)}
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="text" 
                    placeholder='Encargado' 
                />

                <label className='text-xl font-bold text-white mb-1'>Procedencia:</label>
                <input 
                    onChange={(e)=>setProcedencia(e.target.value)}
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="text" 
                    placeholder='Ej. China' 
                />

                <label className='text-xl font-bold text-white mb-1'>Proveedor:</label>
                <input 
                    onChange={(e)=>setProveedor(e.target.value)}
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="text" 
                    placeholder='Ej. Itsuwa' 
                />

                <label className='text-xl font-bold text-white mb-1'>Método de envío:</label>
                <input 
                    onChange={(e)=>setMetodoEnvio(e.target.value)}
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="text" 
                    placeholder='Ej. FedEx' 
                />

                <label className='text-xl font-bold text-white mb-1'>Fecha estimada de llegada:</label>
                <input 
                    onChange={(e)=>setFechaEstimada(e.target.value)}
                    className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
                    type="date" 
                    placeholder='Ej. FedEx' 
                />
                
            </form>
        </div>
        
        <p className='mx-5 my-3 text-2xl font-bold text-white mt-8 text-center'>Paso 2 (Elegir productos):</p>

        <div className='bg-zinc-200 mt-6 m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
            <div className='flex flex-col justify-center w-full bg-transparent overflow-x-scroll md:overflow-auto'>
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
                        {products.map((product)=> (
                            <tr key={product.id} className='divide-x-2 divide-slate-500'>
                                <th className='min-w-[110px] py-2 px-3'>{product.brand}</th>
                                <th className='min-w-[110px] py-2 px-3'>{product.name}</th>
                                <th className='min-w-[110px] py-2 px-3'>{product.puffs}</th>
                                <th className='min-w-[190px] py-2 px-3'>
                                    <div className='flex flex-row items-center justify-center'>
                                        <input 
                                            defaultValue={0}
                                            onChange={(e)=>handleEdit(product.id, product.name, product.brand, product.puffs, product.nic, e.target.value)}
                                            className='w-[90px] h-[30px] appearance-none text-center rounded-lg border-2 border-slate-500' type="number" 
                                        />
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1 className='text-3xl font-bold my-5 mr-5 text-right'>Total: {data.cantidadVapes}</h1>
        </div>
        
        
        <p className='mx-5 my-3 text-2xl font-bold text-white mt-8 text-center'>Paso 3 (Confirmar Datos):</p>


        <div className='bg-zinc-200 mt-6 m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
            <h1 className='text-2xl font-bold text-center flex justify-between'>
                {data.nombre}
            </h1>
            <div className='w-full border-t border-gray-500 my-3'></div>
            <div>
                <p className='font-bold'>Hecho por:</p>
                <p>{data.hechoPor}</p>
            </div>
            <div>
                <p className='font-bold'>Procedencia:</p>
                <p>{data.procedencia}</p>
            </div>
            <div>
                <p className='font-bold'>Proveedor:</p>
                <p>{data.proveedor}</p>
            </div>
            <div>
                <p className='font-bold'>Cantidad de Vapes:</p>
                <p>{data.cantidadVapes}</p>
            </div>
            <div>
                <p className='font-bold'>Método de envío:</p>
                <p>{data.metodoEnvio}</p>
            </div>
            <div>
                <p className='font-bold'>Fecha estimada de llegada:</p>
                <p>{data.fechaEstimada}</p>
            </div>
        </div>

        {/* BOTONES DE CREACIÓN O CANCELACIÓN */}
        <div className='flex flex-row justify-center mb-[120px]'>
            <button onClick={()=> navigate('/pedidos')} className='w-[120px] mt-4 bg-red-600 py-3 px-5 rounded-xl text-white font-bold hover:bg-red-500'>
                Cancelar
            </button>
            <span className='mx-3'></span>
            <button 
                id='buttonSubmit' 
                className='w-[120px] mt-4 bg-lime-500 py-3 px-5 rounded-xl text-white font-bold hover:bg-lime-400' 
                type='submit'
                onClick={()=>handleSubmit()}
            >
                Confirmar
            </button>
        </div>
    </div>
  )
}
