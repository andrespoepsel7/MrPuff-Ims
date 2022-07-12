import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'

export default function ProtectedRoute({children}) {

    // Constantes importadas de context
    const {user} = useUserAuth()

    if(!user){
        return <Navigate to='/'/>
    }else{
        return children
    }
}