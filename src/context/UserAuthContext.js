import React, {createContext, useContext, useEffect, useState} from 'react'
// Funciones necesarias para la autenticación
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from 'firebase/auth'
// Conexión con el servidor de autenticación
import {auth, db} from '../firebase/firebase' 
// Obtener el rol de usuario con cloud functions
import { getAdminRole } from '../firebase/firebase'
// Cloud function to add role to user
import { addAdminRole } from '../firebase/firebase'
import Swal from 'sweetalert2'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { alerta } from '../functions/functions'


// Alertas para mostrar visualmente mensajes
//import Swal from 'sweetalert2'

// Se crea un contexto
const userAuthContext = createContext()

// El contexto recibe a sus hijos
export function UserAuthContextProvider({children}){

    // Hook de usuario
  const [userFirebase, setUserFirebase] = useState("")
  const [user, setUser] = useState("")
  const [role, setRole] = useState("user")
  
  // Función para crear cuenta
  async function signUp(email, password, role, name, dir, ciudad, productos){
    try{
      return await createUserWithEmailAndPassword(auth, email, password).then(async(success)=>{
          console.log("Success", success)
          const date = new Date().toLocaleString()
          console.log(date)
          await giveRole(role, email)
          // Referencia a la base de datos
          const refSucursal = doc(db, `/sucursales/${success.user.uid}`)
          await setDoc(refSucursal, {
            name:name,
            email:success.user.email,
            role:role,
            uid:success.user.uid,
            dir:dir,
            ciudad:ciudad, 
            date:date,
          })
          // Creación del inventrio de la sucursal
          const refInventario = doc(db, `/inventario/${success.user.uid}`)
          await setDoc(refInventario, {
            email:success.user.email,
            uid:success.user.uid,
            productos:productos, 
            ediciones:{},
            fechaCreacion:date,
          })
          alerta(false, 'Exitoso!', 'success', 'Se ha creado correctamente la sucursal!')

        }).catch((err2)=>{
          console.log("Error 2", err2)
        })
      
    }catch(err){
      console.log(err)
      alerta(false, 'Error', 'error', 'Ocurrió un error, volver a intentar...')
    }
    
  }

  // Función para dar un rol al usuario
	async function giveRole(admin, email){
		await addAdminRole({
			email:email,
			admin:admin,
		}).then((response)=> {
			console.log("Response", response)
		}).catch((err)=>{
			console.log(err)
		})
	}

  // Función para iniciar sesión
  async function logIn(email, password){
    try{
      alerta(true, 'Iniciando sesión...', null, 'Obteniendo información de la nube')
      return await signInWithEmailAndPassword(auth, email, password).then(()=>{
        Swal.close()
        console.log("Sesión iniciada correctamente")
      }).catch((err)=>{
        alerta(false, 'Error', 'error', err.message)
      })
    }catch(err){
      console.log(err)
    }
    
  }
  // Función para cerrar sesión
  function logOut(){
    try{
      console.log("Cerró sesión: ", user)
      setRole('user')
      setUser("")
      return signOut(auth)
    }catch(err){
      console.log("Error al cerrar sesión",err.message)
    }
    
  }

  // Función para eliminar un usuario
  async function deleteSucursal(uid){
    try{
      await deleteUser(auth, uid)
      console.log("Sucursal eliminada correctamente")
    }catch(err){
      console.log("Error eliminando usuario",err)
    }
  }

  // UseEffect con unsubscribe para cambiar los datos del usuario cada vez que existe un cambio de estado de autenticación
  useEffect(()=> {
    const unsubscribe =  onAuthStateChanged(auth, (firebaseUser) => {
      if(firebaseUser){
        try{
          setUserFirebase(firebaseUser)
          async function getRole(){
            await getAdminRole({email:firebaseUser.email}).then((promise)=>{
              setRole(promise.data)
            })
          }
          getRole()
          setUser({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            role:role
          })
        }catch(err){
          console.log("Error al correr UseEffect")
        }
      }
      else{
        setUser(null)
      }
      
    })
    return () => {
      unsubscribe()
    }
  },[userFirebase, role])

  // Se devuelven los valores a los hijos correspondientes como un objeto JSX
  return(
    <userAuthContext.Provider value={{user, role, signUp, logIn, logOut, deleteSucursal}}>{children}</userAuthContext.Provider>
  )
}

export function useUserAuth(){
  return useContext(userAuthContext)
}