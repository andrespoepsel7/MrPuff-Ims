import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()
    // Se impporta la función de context
    const {logIn} = useUserAuth()

    // Log out cada vez que se refresca la página
    useEffect(()=>{
        console.log("Cerrando sesión desde Login: ")
        signOut(auth)
        
    },[])

    const handleSubmit = async(e) =>  {
        e.preventDefault()
        setError("")
        try{
            await logIn(email, password).then(()=>{
                navigate("/home")
            }).catch(err=>{
                console.log("Error al iniciar sesión")
            })
            
        }catch(err){
            setError(err.message)
        }
    }

  return (
    <div className='w-full h-screen bg-gradient-to-tr from-cyan-600 to-teal-500 flex'>
        <div className=' rounded-xl grid grid-cols-1 md:grid-cols-2 m-auto h-[460px] shadow-lg shadow-gray-600 sm:max-w-[900px] bg-slate-200'>
            <div className='hidden md:block m-auto mx-3'>
                <img className='h-full w-full' src={logo} alt="logo" />
            </div>
            <div className='p-4'>
                <form className='flex flex-col justify-between' onSubmit={handleSubmit}>
                    <h2 className='text-4xl font-bold text-center mt-10 mb-8 text-slate-700'>Mr.Puff IMS</h2>
                    {error && <p className='text-sm text-red-600'>{error}</p>}
                    <div className='flex flex-col px-8 pt-2'>
                        <label className='text-2xl font-bold text-slate-700 mb-1'>Usuario</label>
                        <input 
                            className='text-lg py-1 px-3 mb-3 rounded-md' 
                            type="text" 
                            placeholder='usuario mrpuff'
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className='text-2xl font-bold text-slate-700 mb-1'>Contraseña</label>
                        <input 
                            className='text-lg py-1 px-3 mb-3 rounded-md' 
                            type="password" 
                            placeholder='contraseña'
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button 
                            id='submitButton'
                            className='mt-8 p-3 bg-slate-700 rounded-2xl text-white font-bold shadow-md shadow-gray-400 hover:scale-[1.05]'
                            type='submit'
                        >
                            Iniciar sesión
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
  )
}
