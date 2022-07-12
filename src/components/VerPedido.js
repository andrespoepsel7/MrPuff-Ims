import React, {useState, useEffect} from 'react'
import { db } from '../firebase/firebase'
import { collection, doc, getDoc, query, updateDoc, where, getDocs } from 'firebase/firestore'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { alerta } from '../functions/functions'

export default function VerPedido() {
  // Se importa el usuario de context para añadir datos al inventario
  const {user} = useUserAuth()

  // Hooks necesarios para modificación
  const [cantidadVapes, setCantidadVapes] = useState()
  const [fechaCreacion, setFechaCreacion] = useState()
  const [fechaEstimada, setFechaEstimada] = useState()
  const [fechaReal, setFechaReal] = useState()
  const [hechoPor, setHechoPor] = useState()
  const [metodoEnvio, setMetodoEnvio] = useState()
  const [nombre, setNombre] = useState()
  const [procedencia, setProcedencia] = useState()
  const [products, setProducts] = useState([])
  const [proveedor, setProveedor] = useState()
  //Hooks para el inventario
  const [inventario, setInventario] = useState([])
  const [ediciones, setEdiciones] = useState([])
  
  // para navegar entre páginas
  const navigate = useNavigate()

  // Para obtener el id del pedido
  const {id} = useParams()

  // Referencia a la base de datos de pedidos
	const docRef = doc(db, "pedidos", id)

  // Obtener la información del pedido desde la base de datos
	const getPedidoById = async()=> {
    alerta(true, 'Buscando datos!', null, 'Obteniendo información de la nube, porfavor espere...')

    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      setCantidadVapes(docSnap.data().cantidadVapes)
      setFechaCreacion(docSnap.data().fechaCreacion)
      setFechaEstimada(docSnap.data().fechaEstimada)
      setFechaReal(docSnap.data().fechaReal)
      setHechoPor(docSnap.data().hechoPor)
      setMetodoEnvio(docSnap.data().metodoEnvio)
      setNombre(docSnap.data().nombre)
      setProcedencia(docSnap.data().procedencia)
      setProducts(docSnap.data().products)
      setProveedor(docSnap.data().proveedor)
      Swal.close()
      
    }else{
      Swal.close()
      navigate('/pedidos')
      console.log('El documento no existe')
    }

		
        
  }

  // Función para obtener el inventario correspondiente al usuario
  const getInventarioByUser = async() => {
    // Referencia a la tabla de usuarios
		const ref = collection(db, 'inventario')
		// Query a la referencia
		const q = query(ref, where("email", "==", user.email))
    
		const inventarioSnapshot = await getDocs(q)
    inventarioSnapshot.forEach((doc)=>{
      setInventario(doc.data().productos)
      setEdiciones(doc.data().ediciones)
    })
    
  }

  // Función para mapear los productos pedidos
  const mapProducts = (products) => {
    return(
      <>
        {products.map((product)=> (
          <tr key={product.id} className='divide-x-2 divide-slate-500'>
              <th className='min-w-[110px] py-2 px-3'>{product.brand}</th>
              <th className='min-w-[110px] py-2 px-3'>{product.name}</th>
              <th className='min-w-[110px] py-2 px-3'>{product.puffs}</th>
              <th className='min-w-[110px] py-2 px-3'>{product.quantity}</th>
          </tr>
        ))}
      </>
      
    )
  }
  // Comentario para GitHub


  // Función para cambiar el estado de el pedido a recibido
  // y para añadir automáticamente los productos al inventario de administrador
  const handleSubmit = async() => {

		const editDate = new Date().toLocaleString()
    const data = {
			cantidadVapes:cantidadVapes,
      fechaCreacion:fechaCreacion,
      fechaEstimada:fechaEstimada,
      fechaReal:editDate,
      hechoPor:hechoPor,
      metodoEnvio:metodoEnvio,
      nombre:nombre,
      procedencia:procedencia,
      products:products,
      proveedor:proveedor
		}

    alerta(true, 'Marcando pedido como recibido!', null, 'Esperando respuesta del servidor...')

    await updateDoc(docRef, data).then(()=>{
      Swal.close()
      alerta(false, 'Exitoso!', 'success', 'El pedido se marcó correctamente como recibido!')
		}).catch((err)=>{
      alerta(false, 'Error!', 'error', err.message)
		})

    // Variable para aumentar productos que no existen en el inventario
    let dataToPush = []
    // Se recorren los arreglos y se suman los datos
    let productsAux = inventario
    for(let i=0;i<products.length;i++){
      let contador = 0
      let coincide = false
      for(let j=0;j<productsAux.length;j++){
        // Si el nombre coincide con el inventario
        if(productsAux[j].name === products[i].name){
          coincide=true
          productsAux[j].quantity += products[i].quantity
        }
        // Si se recorrieron todos los productos y no se encontró resultado
        if(contador === (productsAux.length-1) && coincide === false){
          console.log("Producto no encontrado", products[i])
          dataToPush.push(products[i])
        }
        contador++
      } 
    }
    productsAux.push(...dataToPush)

    // Añadir datos de edición para el historial
    const edicionesAux = ediciones
    const dataEdiciones = {
      fechaEdicion:editDate,
      productos:products,
      entregadoA:user.email, 
      cantidadVapes:cantidadVapes,
    }
    edicionesAux.push(dataEdiciones)

    // Lógica para añadir productos del pedido al inventario
    const inventarioRef = doc(db, "inventario", user.uid)
    // Se cambia los datos de la base de datos
    await updateDoc(inventarioRef, {
      productos:productsAux,
      fechaEdicion:editDate,
      ediciones:edicionesAux,
    }).then(()=>{
      Swal.close()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Exitoso!!',
        showConfirmButton:true,
      })
		}).catch((err)=>{
			Swal.fire({
				position:'center',
				icon:'error',
				title:'Error!'
			})
		})

    navigate('/pedidos')
		
	}

  // Función que corre al renderizar la página
	useEffect(()=>{
    getPedidoById(id)
    getInventarioByUser()
    // eslint-disable-next-line
  }, [])



  return (
    <div className='bg-zinc-200 mt-6 mb-[110px] m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
      <h1 className='text-2xl font-bold text-center flex justify-between'>
          {nombre}
      </h1>
      <div className='w-full border-t border-gray-500 my-3'></div>
      <div>
          <p className='font-bold'>Hecho por:</p>
          <p>{hechoPor}</p>
      </div>
      <div>
          <p className='font-bold'>Procedencia:</p>
          <p>{procedencia}</p>
      </div>
      <div>
          <p className='font-bold'>Proveedor:</p>
          <p>{proveedor}</p>
      </div>
      <div>
          <p className='font-bold'>Cantidad de Vapes:</p>
          <p>{cantidadVapes}</p>
      </div>
      <div>
          <p className='font-bold'>Método de envío:</p>
          <p>{metodoEnvio}</p>
      </div>
      <div>
        <p className='font-bold'>Fecha de creación:</p>
        <p>{fechaCreacion}</p>
      </div>
      <div>
        <p className='font-bold'>Fecha estimada de llegada:</p>
        <p>{fechaEstimada}</p>
      </div>
      <div>
        <p className='font-bold'>Fecha real de llegada:</p>
        {fechaReal === 'En proceso...' ? 
        <p className='text-red-600'>{fechaReal}</p>
        :
        <p className='text-green-600'>{fechaReal}</p>
        }
      </div>

      <div className='w-full border-t border-gray-500 my-3'></div>

      {/* Tabla */}
      <div className='bg-zinc-200 mt-6 m-1 px-4 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
        <div className='flex flex-col justify-center bg-transparent overflow-x-scroll md:overflow-auto'>
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
                    {mapProducts(products)}
                </tbody>
            </table>
        </div>
        <h1 className='text-3xl font-bold my-5 mr-5 text-right'>Total: {cantidadVapes}</h1>
      </div>
      {/* Botón Fecha Llegada */}
      {fechaReal === 'En proceso...' ? 
      <div className='flex flex-row justify-center'>
        <button onClick={()=> navigate('/pedidos')} className='w-[120px] mt-4 bg-red-600 py-3 px-5 rounded-xl text-white font-bold hover:bg-red-500'>
          Volver
        </button>
        <span className='mx-3'></span>
        <button 
          id='buttonSubmit' 
          className='w-[120px] mt-4 bg-lime-500 py-3 px-5 rounded-xl text-white font-bold hover:bg-lime-400' 
          type='submit'
          onClick={()=>handleSubmit()}
        >
          Marcar Llegada
        </button>
      </div>
      :
      <div className='flex flex-row justify-center'>
        <button onClick={()=> navigate('/pedidos')} className='w-[120px] mt-4 bg-red-600 py-3 px-5 rounded-xl text-white font-bold hover:bg-red-500'>
          Volver
        </button>
      </div>
      }

    </div>
  )
}
