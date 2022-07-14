import React from 'react'
import {useNavigate} from 'react-router-dom'
import {MdDeliveryDining} from 'react-icons/md'

export default function EntregasAdmin() {

    const navigate = useNavigate()

  return (
    
    <div>
        <div className='flex justify-end'>
            <button onClick={()=> navigate('/crear-entrega')} className='flex flex-row mr-8 mt-6 bg-blue-600 px-4 py-3 text-white rounded-lg border-2 border-slate-500 hover:bg-blue-500'>
                Nueva Entrega
                <MdDeliveryDining className='w-6 h-6 ml-2'/>
            </button>
        </div>
        <div>
            Historial de Entregas
        </div>
    </div>
  )
}
