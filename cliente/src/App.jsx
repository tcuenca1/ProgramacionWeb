import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const CAMPOS_ROL = {
  Administrador: [
    { nombre: 'nivelAcceso', etiqueta: 'Nivel de acceso', tipo: 'number' },
    { nombre: 'departamento', etiqueta: 'Departamento' },
  ],
  Personal: [
    { nombre: 'turno', etiqueta: 'Turno' },
    { nombre: 'codigoEmpleado', etiqueta: 'Código de empleado' },
  ],
  Invitado: [
    { nombre: 'motivoVisita', etiqueta: 'Motivo de visita' },
    { nombre: 'fechaExpiracion', etiqueta: 'Fecha de expiración', tipo: 'date' },
  ],
}

const FORM_VACIO = {
  nombre: '',
  contrasena: '',
  tipo: 'Administrador',
  ciudad: '',
  telefono: '',
  nivelAcceso: '',
  departamento: '',
  turno: '',
  codigoEmpleado: '',
  motivoVisita: '',
  fechaExpiracion: '',
}

function App() {
  const [mensajeHola, setMensajeHola] = useState('Cargando...')
  const [origen, setOrigen] = useState('orm')
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const obtenerMensaje = () => {
    fetch(`${API}/api/hola`)
      .then((res) => res.json())
      .then((data) => setMensajeHola(data.message))
      .catch(() => setMensajeHola('Error al conectar con el servidor'))
  }

  const cargarUsuarios = () => {
    fetch(`${API}/6A/${origen}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setMensaje('Error al conectar con el servidor'))
  }

  useEffect(() => {
    cancelar()
    cargarUsuarios()
  }, [origen])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const editar = (usuario) => {
    const datos = { ...FORM_VACIO }
    for (const campo of Object.keys(FORM_VACIO)) {
      if (usuario[campo] !== null && usuario[campo] !== undefined) datos[campo] = String(usuario[campo])
    }
    datos.fechaExpiracion = datos.fechaExpiracion.slice(0, 10)
    setForm(datos)
    setEditandoId(usuario.id)
    setMensaje('')
  }

  const cancelar = () => {
    setForm(FORM_VACIO)
    setEditandoId(null)
  }

  const guardar = (e) => {
    e.preventDefault()
    const url = editandoId ? `${API}/6A/${origen}/usuarios/${editandoId}` : `${API}/6A/${origen}/usuarios`
    fetch(url, {
      method: editandoId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setMensaje(editandoId ? 'Usuario actualizado' : 'Usuario agregado')
        cancelar()
        cargarUsuarios()
      })
      .catch((error) => setMensaje(`Error: ${error.message}`))
  }

  return (
    <div>
      <h1>Cliente React</h1>
      <button onClick={obtenerMensaje}>peticion</button>
      <p>{mensajeHola}</p>

      <h2>Usuarios</h2>

      <label>
        Base de datos:{' '}
        <select value={origen} onChange={(e) => setOrigen(e.target.value)}>
          <option value="orm">ORM - Sequelize (PostgreSQL)</option>
          <option value="odm">ODM - Mongoose (MongoDB)</option>
        </select>
      </label>

      <h2>{editandoId ? `Editar usuario ${editandoId}` : 'Agregar usuario'}</h2>
      <form onSubmit={guardar}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} required />
        <input
          name="contrasena"
          type="password"
          placeholder={editandoId ? 'Contraseña (vacío = no cambiar)' : 'Contraseña'}
          value={form.contrasena}
          onChange={cambiar}
          required={!editandoId}
        />
        <select name="tipo" value={form.tipo} onChange={cambiar} disabled={!!editandoId}>
          <option>Administrador</option>
          <option>Personal</option>
          <option>Invitado</option>
        </select>
        <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={cambiar} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={cambiar} />
        {(CAMPOS_ROL[form.tipo] ?? []).map((campo) => (
          <input
            key={campo.nombre}
            name={campo.nombre}
            type={campo.tipo ?? 'text'}
            placeholder={campo.etiqueta}
            title={campo.etiqueta}
            value={form[campo.nombre]}
            onChange={cambiar}
          />
        ))}
        <div>
          <button type="submit">{editandoId ? 'Guardar cambios' : 'Agregar'}</button>
          {editandoId && (
            <button type="button" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <h2>Lista de usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ciudad</th>
            <th>Teléfono</th>
            <th>Datos del rol</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.tipo}</td>
              <td>{u.ciudad}</td>
              <td>{u.telefono}</td>
              <td>
                {(CAMPOS_ROL[u.tipo] ?? [])
                  .map((c) => (c.tipo === 'date' ? u[c.nombre]?.slice(0, 10) : u[c.nombre]))
                  .filter((v) => v !== null && v !== undefined)
                  .join(' / ')}
              </td>
              <td>
                <button onClick={() => editar(u)}>Editar</button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="7">No hay usuarios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
