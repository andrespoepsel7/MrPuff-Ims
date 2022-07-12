import React, {useState, useEffect} from 'react'
import { useUserAuth } from '../context/UserAuthContext'
import Swal from 'sweetalert2'
import { db } from '../firebase/firebase'
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore'

export default function CrearSucursal() {

  // Hooks necesarios
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [name, setName] = useState("")
  const [dir, setDir] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [products, setProducts] = useState([])
  const [productsAux, setProductsAux] = useState([])

  // Funciones y estados de context
  const{signUp, logOut} = useUserAuth()

  // Función para asignar únicamente los valores necesarios de los productos al inventario
  const asignarProductos = () => {
    products.map((product)=>{
      productsAux.push({
        brand:product.brand,
        id:product.id,
        name:product.name,
        nic:product.nic,
        puffs:product.puffs,
        quantity:0
      })
    })
  }

  // Funcion al crear la nueva sucursal
  const handleSubmit = async(e) => {
    e.preventDefault()
    // Todos los usuarios creados tienen rol de usuario
    const role = 'user'
    console.log(email, password, password2, role, dir, ciudad)
    if(password === password2){
      try{
        Swal.fire({
          position: 'center',
          title: 'Iniciando sesión!',
          text:'Obteniendo información de la nube...',
          showConfirmButton: false,
          didOpen: ()=>{
            Swal.showLoading()
          },
        })
        asignarProductos()
        await signUp(email, password, role, name, dir, ciudad, productsAux).then(()=>{
          Swal.close()
          logOut()
        })
        
        
        
      }catch(err){
        console.log(err)
      }
    }else{
      console.log("Las contraseñas no coinciden")
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error!',
        text:'Las contraseñas no coinciden ó no se asignó el rol correctamente...',
        showConfirmButton: true,
      })
    }
    
  }

  // Para obtener los productos de la base de datos y asignarlos al inventario de la 
  // sucursal que está siendo creada
  useEffect(()=>{

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
			Swal.close()
		})
    
		return unsub
    
  }, [])

  return (
    <div className='pb-2'>
      <div className='flex flex-col my-4 mx-6 p-4 items-center justify-center
      bg-sky-700 rounded-3xl border-2 border-cyan-600 shadow-md shadow-black md:p-[50px] md:mx-[140px] md:mt-[10px]'>
          <h1 className='text-3xl font-bold text-white'>Crear Sucursal</h1>
          <form onSubmit={handleSubmit} className='flex flex-col py-3 md:py-5'>

            <label className='text-xl font-bold text-white mb-1'>Nombre:</label>
            <input 
              onChange={(e)=>setName(e.target.value)} 
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="text" 
              placeholder='Sucursal Mr.Puff' 
            />
            <label className='text-xl font-bold text-white mb-1'>Ciudad:</label>
            <input 
              onChange={(e)=>setCiudad(e.target.value)} 
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="text" 
              placeholder='Ciudad Bolivia' 
            />
            <label className='text-xl font-bold text-white mb-1'>Email (uid):</label>
            <input 
              onChange={(e)=>setEmail(e.target.value)} 
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="text" 
              placeholder='ejemplo@mrpuff.bo' 
            />
            <label className='text-xl font-bold text-white mb-1'>Dirección:</label>
            <input 
              onChange={(e)=>setDir(e.target.value)} 
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="text" 
              placeholder='Dirección sucursal' 
            />
            <label className='text-xl font-bold text-white mb-1'>Contraseña:</label>
            <input 
              onChange={(e)=> setPassword(e.target.value)}
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="password" 
              placeholder='min 6 caracteres' 
            />
            <label className='text-xl font-bold text-white mb-1'>Repetir Contraseña:</label>
            <input 
              onChange={(e)=> setPassword2(e.target.value)}
              className='py-2 px-3 border-2 mb-1 border-slate-400 rounded-lg' 
              type="password" 
              placeholder='min 6 caracteres' 
            />
            <button id='buttonSubmit' className='mt-4 bg-lime-500 mx-auto py-3 px-5 rounded-xl text-white font-bold hover:bg-lime-400' type='submit'>Crear</button>
          </form>
      </div>
    </div>
  )
}
