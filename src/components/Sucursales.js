import React, {useState, useEffect} from 'react'
import { db } from '../firebase/firebase'
import {collection, getDocs, deleteDoc,doc} from 'firebase/firestore'
import Swal from 'sweetalert2'
import {AiFillDelete, AiOutlineUserAdd} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { alerta } from '../functions/functions'

export default function Sucursales() {
  
  // Hook para las sucursales
  const [sucursales, setSucursales] = useState([])
  // Referencia a la base de datos para recibir sucursales
  const refSucursales = collection(db, "sucursales")
  // Para navegar entre páginas
  const navigate = useNavigate()

  // Función para obtener sucursales
  const getSucursales = async()=>{
    alerta(true, 'Buscando datos!', null, 'Obteniendo datos de la nube, porfavor espere...')
    const data = await getDocs(refSucursales)
    setSucursales(
      data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
    )
    Swal.close()
  }

  // Función para eliminar sucursal
  const deleteSucursales = async(id) => {
    const sucursalDoc = doc(db, "sucursales", id)
    const inventarioDoc = doc(db, "inventario", id)
    await deleteDoc(sucursalDoc)
    await deleteDoc(inventarioDoc)
    getSucursales()
  }

  // Función para asegurar la eliminación de la sucursal
  const confirmDelete=async(id)=>{
    Swal.fire({
      title: '¿Eliminar sucursal?',
      text: "No se podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor:'#3085d6',
      confirmButtonText:'Sí, eliminar!'
    }).then((result)=>{
        if(result.isConfirmed){
            deleteSucursales(id)
            Swal.fire({
              title: 'Eliminado',
              text: `${id} eliminada correctamente!`,
              icon: 'success',
            })
        }
    }).catch((err)=>{
      console.log("Error eliminando la sucursal deseada!", err)
    })
  }
  // Actualizar datos
  useEffect(()=>{
    try{
      console.log("Obteniendo información de las sucursales")
      getSucursales()
    }catch(err){
      console.log("Error al obtener datos", err)
    }
    
  }, [])

  return (
    <div className='grid grid-cols-1 items-center justify-center mx-7 pb-6 md:mx-[100px]'>
      <div className='flex'>
        <button onClick={()=>navigate('/crear-sucursal')} className='flex flex-row ml-auto mr-8 mt-6 bg-blue-600 px-4 py-3 text-white rounded-lg border-2 border-slate-500 hover:bg-blue-500'>
          Crear Sucursal
          <AiOutlineUserAdd className='ml-2 h-5 w-5'/>
        </button>
      </div>
      {
        sucursales.map((sucursal) => (
          <div key={sucursal.uid} className='bg-zinc-200 mt-6 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600 md:px-12'>
            <h1 className='text-2xl font-bold text-center flex justify-between'>
              {sucursal.name}
              <div className='flex flex-row'>
                <AiFillDelete onClick={()=>confirmDelete(sucursal.id)} className='mr-1 mt-1 cursor-pointer'/>
              </div>
            </h1>
            <div className='w-full border-t border-gray-500 my-3'></div>
            <div className='mb-2'>
              <p className='font-bold'>Ciudad:</p>
              <p>{sucursal.ciudad}</p>
            </div>
            <div className='mb-2'>
              <p className='font-bold'>Dirección:</p>
              <p>{sucursal.dir}</p>
            </div>
            <div className='mb-2'>
              <p className='font-bold'>Email:</p>
              <p>{sucursal.email}</p>
            </div>
            <div className='mb-2'>
              <p className='font-bold'>Rol:</p>
              <p>{sucursal.dir === 'admin' ? "Administrador":"Usuario"}</p>
            </div>
            <div className='mb-2'>
              <p className='font-bold'>Uid:</p>
              <p>{sucursal.uid}</p>
            </div>
          </div>
        ))
      }

    </div>
  )
}
