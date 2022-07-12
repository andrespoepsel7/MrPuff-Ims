import React, { useEffect } from 'react'
import { useState } from 'react'
import { useUserAuth } from '../context/UserAuthContext'
// Importaciones para íconos
import {MdInventory, MdPointOfSale} from 'react-icons/md'
import {BiPurchaseTagAlt, BiGitBranch} from 'react-icons/bi'
import {TbTruckDelivery} from 'react-icons/tb'
import { AiFillHome} from 'react-icons/ai'
import {RiAdminFill} from 'react-icons/ri'
import {TbLogout} from 'react-icons/tb'
import {GiHamburgerMenu, GiCancel} from 'react-icons/gi'
import {FaUser} from 'react-icons/fa'
import {BsBoxSeam} from 'react-icons/bs'
// Para navegar entre páginas 
import { useNavigate } from 'react-router-dom'
// Logo para utilizar
import logo from '../assets/logo.png'
// Swal
import Swal from 'sweetalert2'

export default function Main({componente}) {
    // Para poder navegar entre páginas 
    const navigate = useNavigate()
    // HOOKS
	// Usuario y funcion de logOut de context
    const {user, role, logOut} = useUserAuth()
	// Estado para mostrar el menú en aplicación móvil
	const [toggle, setToggle] = useState(false)
    // Nombre que se mostrará en el displAY
    const [nombreSucursal, setNombreSucursal] = useState("")
    
    useEffect(()=>{
        setNombreSucursal(user.email.split('@')[0].toUpperCase())
    }, [nombreSucursal, user])

	// Función para renderizar una opcion en Web
	const renderOption = (option) => {
        return option
	}

	// Función para hacer logout
  const handleLogOut = async() => {
    try{
      await logOut().then(()=>{
				console.log("Se cerró sesión correctamente",user)
                Swal.close()
			}).catch((err)=>{
				console.log("Error al cerrar sesión",err)
			})
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='bg-slate-100 flex flex-col'>
        {/* SIDEBAR */}
        <div className='hidden fixed left-0 top-0 h-screen sidebar p-2 text-center bg-gray-800 md:block w-[300px]'>
            {/* {Titulo} */}
            <div className='text-gray-100 text-xl'>
                <div className='p-2.5 mt-3 ml-2.5 flex items-center justify-center text-gray-100'>
                    {role === 'admin' ? 
                    <div className='flex flex-row'>
                        <RiAdminFill className='h-7 w-7'/>
                        <h1 className="font-bold text-[19px] ml-3">{nombreSucursal}-Mr.Puff</h1>
                    </div>
                    :
                    <div className='flex flex-row'>
                        <FaUser className='h-7 w-7'/>
                        <h1 className="font-bold text-[19px] ml-3">{nombreSucursal}-Mr.Puff</h1>
                    </div>
                    }
                </div>
                <hr className='my-2'/>
            </div>
            {/* LOGO */}
            <div className='w-full py-3 px-10'>
                <img src={logo} alt="logo" />
            </div>
            {/* BOTONES */}
            {role === 'admin' ? 
            <div className='flex flex-col items-center justify-center mt-6'>

                <button onClick={()=>navigate('/inventario')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                    <MdInventory className='ml-4 mr-1'/>
                    <p className='mt-0'>Inventario</p>
                </button>

                <button onClick={()=>navigate('/productos')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                    <BsBoxSeam className='ml-4 mr-1'/>
                    <p className='mt-0'>Productos</p>
                </button>

                <button onClick={()=>navigate('/ventas')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                    <MdPointOfSale className='ml-4 mr-1'/>
                    <p className='mt-0'>Ventas</p>
                </button>

                <button onClick={()=>navigate('/pedidos')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                    <BiPurchaseTagAlt className='ml-4 mr-1'/>
                    <p className='mt-0'>Pedidos</p>
                </button>

                <button onClick={()=>navigate('/entregas')} className={`w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500`}>
                    <TbTruckDelivery className='ml-4 mr-1'/>
                    <p className='mt-0'>Entregas</p>
                </button>

                <button onClick={()=>navigate('/sucursales')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                    <BiGitBranch className='ml-4 mr-1'/>
                    <p className='mt-0'>Sucursales</p>
                </button>

            </div>  
            :
            <div className='flex flex-col items-center justify-center mt-6'>

                    <button onClick={()=>navigate('/inventario')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdInventory className='ml-4 mr-1'/>
                        <p className='mt-0'>Inventario</p>
                    </button>

                    <button onClick={()=>navigate('/productos')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <BsBoxSeam className='ml-4 mr-1'/>
                        <p className='mt-0'>Productos</p>
                    </button>

                    <button onClick={()=>navigate('/ventas')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdPointOfSale className='ml-4 mr-1'/>
                        <p className='mt-0'>Ventas</p>
                    </button>

                    <button onClick={()=>navigate('/entregas')} className={`w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500`}>
                        <TbTruckDelivery className='ml-4 mr-1'/>
                        <p className='mt-0'>Entregas</p>
                    </button>
            </div>
            }
        </div>
        {/* Mobile Content */}
        <div className='bg-zinc-100 flex flex-col md:ml-[300px]'>
            {/* Top Navbar */}
            <header className='sticky top-0 bg-slate-900 text-gray-100 h-[69px] md:flex'>
                <div className='flex flex-row'>
                    {role === 'admin' ? 
                    <div className='flex flex-row cursor-pointer md:hidden'>
                        <RiAdminFill className='ml-4 mt-5 h-6 w-6'/>
                        <h1 className="text-xl ml-1 mt-[18px]">{nombreSucursal}-Mr.Puff</h1>
                    </div>
                    :
                    <div className='flex flex-row cursor-pointer md:hidden'>
                        <FaUser className='ml-4 mt-5 h-6 w-6'/>
                        <h1 className="text-xl ml-1 mt-[18px]">{nombreSucursal}-Mr.Puff</h1>
                    </div>
                    }
                    <div onClick={()=>setToggle(!toggle)} className='flex flex-row cursor-pointer ml-auto mr-5 md:hidden'>
                        {!toggle ? <GiHamburgerMenu className='ml-7 mt-5 h-6 w-6'/>: <GiCancel className='ml-7 mt-5 h-6 w-6'/>}
                        <h1 className="text-xl ml-1 mt-[18px]">Menú</h1>
                    </div>
                    
                    <div onClick={()=>navigate('/home')} className='hidden cursor-pointer md:flex flex-row'>
                        <AiFillHome className='h-6 w-6 mt-5 ml-7'/>
                        <h1 className='text-xl ml-1 mt-[18px]'>Inicio</h1>
                    </div>
                    
                </div>
                <div onClick={()=>handleLogOut()} className='hidden cursor-pointer md:flex flex-row ml-auto'>
                    <h1 className='text-xl mt-[18px] mr-1'>Cerrar Sesión</h1>
                    <TbLogout className='h-6 w-6 mt-5 mr-7'/>
                </div>
            </header>
            {/* MOBILE MENU */}
            {role === 'admin' ? 
            <div className={`${toggle ? 'block':'hidden'} fixed top-0 left-0 p-4 bg-gray-800 block md:hidden`}>
                <div className='flex flex-col items-center justify-center mt-0 shadow-lg shadow-slate-800'>
                    <span className='mt-4'></span>

                    <button onClick={()=>{navigate('/home')}} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <AiFillHome className='ml-4 mr-1'/>
                        <p className='mt-0'>Inicio</p>
                    </button>

                    <button onClick={()=>navigate('/inventario')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdInventory className='ml-4 mr-1'/>
                        <p className='mt-0'>Inventario</p>
                    </button>

                    <button onClick={()=>navigate('/productos')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <BsBoxSeam className='ml-4 mr-1'/>
                        <p className='mt-0'>Productos</p>
                    </button>

                    <button onClick={()=>navigate('/ventas')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdPointOfSale className='ml-4 mr-1'/>
                        <p className='mt-0'>Ventas</p>
                    </button>

                    <button onClick={()=>navigate('/pedidos')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <BiPurchaseTagAlt className='ml-4 mr-1'/>
                        <p className='mt-0'>Pedidos</p>
                    </button>

                    <button onClick={()=>navigate('/entregas')} className={`w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500`}>
                        <TbTruckDelivery className='ml-4 mr-1'/>
                        <p className='mt-0'>Entregas</p>
                    </button>

                    <button onClick={()=>navigate('/sucursales')} className=' w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <BiGitBranch className='ml-4 mr-1'/>
                        <p className='mt-0'>Sucursales</p>
                    </button>

                    <button onClick={()=>handleLogOut()} className='w-[240px] bg-red-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-red-500'>
                        <TbLogout className='ml-4 mr-1'/>
                        <p className='mt-0'>Cerrar Sesión</p>
                    </button>

                </div>
            </div>
            :
            <div className={`${toggle ? 'block':'hidden'} fixed top-0 left-0 p-4 bg-gray-800 block md:hidden`}>
                <div className='flex flex-col items-center justify-center mt-0 shadow-lg shadow-slate-800'>
                    <span className='mt-4'></span>

                    <button onClick={()=>navigate('/home')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <AiFillHome className='ml-4 mr-1'/>
                        <p className='mt-0'>Inicio</p>
                    </button>

                    <button onClick={()=>navigate('/inventario')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdInventory className='ml-4 mr-1'/>
                        <p className='mt-0'>Inventario</p>
                    </button>

                    <button onClick={()=>navigate('/productos')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <BsBoxSeam className='ml-4 mr-1'/>
                        <p className='mt-0'>Productos</p>
                    </button>

                    <button onClick={()=>navigate('/ventas')} className='w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500'>
                        <MdPointOfSale className='ml-4 mr-1'/>
                        <p className='mt-0'>Ventas</p>
                    </button>

                    <button onClick={()=>navigate('/entregas')} className={`w-[240px] bg-cyan-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-cyan-500`}>
                        <TbTruckDelivery className='ml-4 mr-1'/>
                        <p className='mt-0'>Entregas</p>
                    </button>

                    <button onClick={()=>handleLogOut()} className='w-[240px] bg-red-600 text-xl text-gray-100 text-left h-[45px] 
                    flex items-center rounded-md mb-4 hover:bg-red-500'>
                        <TbLogout className='ml-4 mr-1'/>
                        <p className='mt-0'>Cerrar Sesión</p>
                    </button>

                </div>
            </div>
            }
            {/* CONTENIDO */}
            <div className='bg-gradient-to-tr from-cyan-600 to-teal-500'>
                <div className='mb-[80px] min-h-screen'>
                    {renderOption(componente)}
                </div>
                <footer className='fixed bottom-0 pb-4 h-[80px] bg-slate-900 w-full text-zinc-200 shadow-2xl shadow-black'>
                    <p className='mt-3 text-center'>Copyright (c) Mr.Puff Bolivia 2022</p>
                    <p className='mt-1 text-center'>Sitio desarrollado por Andrés Poepsel Vásquez</p>
                </footer>
            </div>
        </div>
    </div>
  )
}
