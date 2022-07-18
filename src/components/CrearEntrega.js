import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { alerta } from '../functions/functions'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import Swal from 'sweetalert2'
import { useUserAuth } from '../context/UserAuthContext'

export default function CrearEntrega() {

    // Informacion del usuario administrador
    const {user} = useUserAuth(

    )
    // Para navegar entre páginas
    const navigate = useNavigate()

    // Hooks
    const [sucursales, setSucursales] = useState([])
    const [opcion, setOpcion] = useState("")
    const [productos, setProductos] = useState([])
    const [suma, setSuma] = useState(0)
    const [productsAux, setProductsAux] = useState([])
    const [productosSucursal, setProductosSucursal] = useState([])
    const [ediciones, setEdiciones] = useState([])

    // Funciones
    // Función para obtener sucursales
    const getSucursales = async()=>{
        // Referencia a las sucursales
        const refSucursales = collection(db, "sucursales")
        // Se obtienen las sucursales
        alerta(true, 'Buscando datos!', null, 'Obteniendo datos de la nube, porfavor espere...')
        const data = await getDocs(refSucursales)
        setSucursales(
        data.docs.map((doc)=> ({...doc.data(), id:doc.id}))
        )
        Swal.close()
    }
    // Función para obtener inventario del usuario
    const getInventario = async() => {  

        // Referencia a la tabla de inventario
        const ref = collection(db, 'inventario')
        // Query a la referencia
        const q = query(ref, where("email", "==", user.email))
        
        const inventarioSnapshot = await getDocs(q)
        inventarioSnapshot.forEach((doc)=>{
        setProductos(doc.data().productos)
        })
        Swal.close()
    }

    // Función para editar la cantidad que se elige de cada producto
    const handleEdit = (id, name, brand, puffs, nic, value, quantity) => {
        if(value >= 0){
            if(value > quantity){
                alerta(false, 'Error!', 'error', `La cantidad máxima es ${quantity}`)
            }else{
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
        }
        const sumaTodos = productsAux.map(item=>parseInt(item.quantity)).reduce((prev, curr)=>prev+curr, 0)
        setSuma(sumaTodos)
        console.log(productsAux)
    }

    // Funcion para crear la entrega
    const handleSubmit = async() => {
        const date = new Date()
        const index = sucursales.findIndex(sucursal=>sucursal.uid === opcion)
        if(index === -1){
            alerta(false, 'Error!', 'error', 'Se debe elegir una sucursal...')
        }else{
            if(suma < 1){
                alerta(false, 'Error', 'error', 'Se debe entregar al menos un producto...')
            }else{
                const refSucursal = doc(db, 'inventario', opcion)
                const snapSucursal = await getDoc(refSucursal)
                const inventarioSucursal = snapSucursal.data()
                setProductosSucursal(inventarioSucursal.productos)
                setEdiciones(inventarioSucursal.ediciones)
                console.log(productosSucursal)
                
                const edicionesAux = ediciones
                const dataEdiciones = {
                fechaEdicion:date,
                productos:productsAux,
                entregadoA:sucursales[index].email, 
                cantidadVapes:suma,
                }
                console.log(dataEdiciones)
                edicionesAux.push(dataEdiciones)
                console.log(edicionesAux)
                                
            }
        }
        
            

        // const entregaData = {
        //     productos:productsAux,
        //     fecha:date,
        //     cantidadVapes:suma,
        //     entregadoA:sucursal.name,
        // }
    }



    // Obtener la información cada vez que se carga la página
    useEffect(() => {
        getSucursales()
        getInventario()
        console.log(sucursales)
    }, [])
    

  return (
    <div>
        <h1 className='text-4xl font-bold text-center text-white mt-4'>Crear Entrega</h1>
        {/* Paso 1 */}
        <div className='bg-zinc-200 mt-3 mx-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
            <h1 className='text-center text-2xl mb-5 font-bold text-slate-900 mt-2'>Paso 1 (Seleccionar sucursal):</h1>
            <div className='flex justify-center mb-5'>
                <select 
                    id='slectItem'
                    className='text-center px-5 py-3 min-w-[250px] rounded-lg shadow-md shadow-gray-600'
                    onChange={(e)=>{
                        setOpcion(e.target.value)
                    }}
                >
                    <option value="default">Elegir Sucursal</option>
                    {sucursales.map((sucursal)=>(
                        <option value={sucursal.uid}>{sucursal.name}</option>
                    ))}
                </select>
            </div>
        </div>
        {/* Paso 2 */}
        <div className='bg-zinc-200 mt-6 m-3 px-5 py-4 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
            <h1 className='text-center text-2xl font-bold text-slate-900 mt-2 mb-5'>Paso 2 (Seleccionar productos):</h1>
            <div className='flex flex-col justify-center w-full bg-transparent overflow-x-scroll md:overflow-auto'>
                <table className='mx-3 w-full table-auto'>
                    <thead className='bg-sky-700 border-2 border-slate-500 text-white'>
                        <tr className='divide-x-2 divide-slate-500'>
                            <th className='min-w-[110px] py-2 px-3'>Marca</th>
                            <th className='min-w-[110px] py-2 px-3'>Nombre</th>
                            <th className='min-w-[110px] py-2 px-3'>Puffs</th>
                            <th className='min-w-[110px] py-2 px-3'>Cantidad</th>
                            <th className='min-w-[110px] py-2 px-3'>Entregar</th>
                        </tr>
                    </thead>
                    <tbody className='bg-slate-100 border-2 border-slate-500 divide-y-2 divide-slate-500'>
                        {productos.map((product)=> (
                            <tr key={product.id} className='divide-x-2 divide-slate-500'>
                                <th className='min-w-[110px] py-2 px-3'>{product.brand}</th>
                                <th className='min-w-[110px] py-2 px-3'>{product.name}</th>
                                <th className='min-w-[110px] py-2 px-3'>{product.puffs}</th>
                                <th className='min-w-[110px] py-2 px-3'>{product.quantity}</th>
                                <th className='min-w-[190px] py-2 px-3'>
                                    <div className='flex flex-row items-center justify-center'>
                                        <input 
                                            defaultValue={0}
                                            onChange={(e)=>handleEdit(product.id, product.name, product.brand, product.puffs, product.nic, e.target.value, product.quantity)}
                                            className='w-[90px] h-[30px] appearance-none text-center rounded-lg border-2 border-slate-500' type="number" 
                                        />
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1 className='text-3xl font-bold my-5 mr-5 text-right'>Total: {suma}</h1>
        </div>

        {/* Paso 3 */}
        <div className='mb-[100px] bg-zinc-200 mt-3 mx-3 rounded-2xl border-2 border-zinc-500 shadow-lg shadow-gray-600'>
            <h1 className='text-center text-2xl font-bold text-slate-900 mt-5 mb-2'>Paso 3 (Confirmar Entrega):</h1>
            <div className='flex flex-row justify-center mb-7'>
                <button onClick={()=> navigate('/entregas-admin')} className='w-[120px] mt-4 bg-red-600 py-3 px-5 rounded-xl text-white font-bold hover:bg-red-500'>
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
    </div>
  )
}
