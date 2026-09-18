import { AdapEntrada_PeticionWeb } from './infraestructura/adaptadores/entrada/AdapEntrada_PeticionWeb.js'
import { CasoUso_Mensaje } from './aplicacion/caso_uso/CasoUso_Mensaje.js'
import express from 'express'
import cors from 'cors'
import { CasoUso_Usuario } from './aplicacion/caso_uso/CasoUso_Usuario.js'
import { AdapEntrada_UsuarioWeb } from './infraestructura/adaptadores/entrada/AdapEntrada_UsuarioWeb.js'

const app = express()
app.use(cors())
const msj = new CasoUso_Mensaje();
const adapEntrada= new AdapEntrada_PeticionWeb(msj);
app.get('/api/hola', (req, res) => {
  res.json({ message: 'Hola desde el servidor con Docker' })
})

//INYECCION DE DEPENDENCIAS
app.get('/6A/mensaje-bloqueante', (req, res) => {
  let c = Date.now();
  while(Date.now()-c < 10000){
  }
  adapEntrada.leerMensaje(req,res);}
)

app.get('/6A/mensaje-no-bloqueante', async(req, res) => {
  let c = Date.now();
  await new Promise(promise =>{
    setTimeout(promise, 10000);
    adapEntrada.leerMensaje(req,res);
  });
  }
)

app.get('/6A/usuario', async(req, res) => {
  const usu= req.query.usu;
  const cont = req.query.cont;
  const cuUsuario= new CasoUso_Usuario();
  const adap = new AdapEntrada_UsuarioWeb(cuUsuario);

    adapEntrada.leerMensaje(req,res);
    adap.autentica(req,res);
  }
)

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})