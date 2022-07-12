import React from 'react'
import logo from '../assets/logo.png'

export default function InformacionIms() {
  return (
    <div className='w-full h-full'>
      <div className='flex flex-col items-center justify-center'>
        <img src={logo} className='mt-4 h-[280px] md:hidden' alt="logo" />
        <div className='my-4 mx-6 py-3 px-4 bg-sky-700 
        rounded-3xl border-2 border-cyan-600 shadow-md shadow-black md:w-[500px] md:mt-[30px] md:py-7 md:px-[50px]'>
          <p className='text-white md:text-3xl '>
            Sistema de control de inventario de Mr.Puff (Inventory Management System).
            Sitio desarrollado con el fin de facilitar el control de inventario en diferentes sucursales,
            así como también de pedidos y entregas. La ventaja es que se puede acceder a la información desde cualquier
            parte con una conexión a internet. Otra ventaja del sistema es la creación, lectura, modificación y eliminación
            de elementos en las bases de datos en tiempo real.
          </p>
          
        </div>
      </div>
    </div>
  )
}
