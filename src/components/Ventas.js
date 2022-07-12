import React, {useState} from 'react'

export default function Ventas() {
  //HOOKS
  const [date, setDate] = useState()
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(typeof(date))
    console.log(date)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input onChange={(e)=>setDate(e.target.value)} type="date" />
        <button type='submit'>Mostrar Fecha</button>
      </form>
      

    </div>
  )
}
