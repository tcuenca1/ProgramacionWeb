import { Mensaje } from '../../dominio/Mensaje.js';

export class CasoUso_Mensaje {
    constructor(){
        this.mensaje = new Mensaje();
    }

    leerMensaje(){
        return this.mensaje.holaMundo();    
    }
}