import React from 'react'
import Main from './Main'
import CreateProduct from '../components/CreateProduct'

export default function HomeCrearProducto() {
  return (
    <>
    <Main componente={<CreateProduct/>}/>
    </>
  )
}
