import { useEffect, useState } from 'react'

function App() {
  const [mensaje, setMensaje] = useState('Cargando...')

  const obtenerMensaje = () => {
    fetch('http://localhost:3000/api/hola')
      .then((res) => res.json())
      .then((data) => setMensaje(data.message))
      .catch(() => setMensaje('Error al conectar con el servidor'))
  }

  return (
    <div>
      <h1>Cliente React</h1>
      <button onClick={obtenerMensaje}>peticion</button>
      <p>{mensaje}</p>
    </div>
  )
}